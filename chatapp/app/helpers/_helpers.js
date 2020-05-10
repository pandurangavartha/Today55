var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/*
 *  providing the helper functions
 */
module.exports = {
    /*
	 * Helper function to format all error and success response to maintain common format
	 * return json output
	*/

	formatResponse: function (response, res, error) {
		// console.log('catch response',response);
		var httpstatus = 200;
		if (typeof response.httpstatus != 'undefined' && response.httpstatus != '') {
			var httpstatus = response.httpstatus;
		}
		if (httpstatus != 200 && process.env.WINSON_ERROR_LOG == true) {
			winston.log('error', response);
		}
		var output = {};
		if (response !== '') {
			var successStatus = true;
			output['success'] = successStatus;
			if (typeof response.msg != 'undefined' && response.msg != '') {
				var responseMessage = response.msg;
				output['msg'] = responseMessage;
			}
			if (typeof response.data != 'undefined' && response.data != '') {
				var responseData = response.data;
				output['data'] = responseData;
			}
		} else {
			// console.log(error);
			// return false;
			var successStatus = false;

			if (typeof error.httpstatus != 'undefined' && error.httpstatus != '') {
				var httpstatus = error.httpstatus;
				delete error.httpstatus;
			} else {
				var httpstatus = helper.getHttpStatusFromMongooseError(error.code);;
			}
			output = {
				success: successStatus,
				msg: error.msg,
			}
		}
		// console.log('output',output);
		res.status(httpstatus).json(output)
	},
	/*
 * Helper function to validate all required parameters.
 * return ===> error = httpstatus 422, success = true.
*/

	validateRequiredParams: function (req, res, requiredParams) {
		return new Promise(function (resolve, reject) {
			var errorCount = 0;
			var missingParams = [];
			requiredParams.forEach(function (obj) {
				if (typeof req.body[obj] == 'undefined' || req.body[obj] == '') {
					errorCount++;
					missingParams.push(obj);
				}
			});
			if (errorCount > 0) {
				var error = {
					success: false,
					httpstatus: 422,
					msg: 'Missing required parameters',
					data: {
						missingParams: missingParams
					}
				};
				helper.formatResponse(error, res);
			} else {
				resolve({
					success: true,
					data: []
				});
			}

		})
	},
	getHttpStatusFromMongooseError: function (errorCode) {
		var codeLibrary = {};
		var code = '';
		codeLibrary = {
			'11000': 409
		};
		if ((typeof codeLibrary[errorCode] != 'undefined') && codeLibrary[errorCode] != '') {
			code = codeLibrary[errorCode];
		} else {
			code = 400; // default
		}
		return code;
	},

	/*
	 * Helper function to parse unique field name from moongose error syntex.
	 * return ===> error = httpstatus 422, success = true.
	*/

	parseUniqueFieldError: function (errorCode) {
		var field = errorCode.message.split('index: ')[1];
		// now we have `keyname_1 dup key`
		field = field.split(' dup key')[0];
		field = field.substring(0, field.lastIndexOf('_')); // returns keyname
		return field;
	},


	b64e: function (str) {
		return new Buffer(str).toString('base64')
	},
	b64d: function (str) {
		return new Buffer(str, 'base64').toString('ascii')
	},
    /**
     * @description To generate randem string
     * @param {type} len
     * @returns {module.exports.generateRandomString.token|String}
     */
	generateRandomString: function (len) {
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var token = '';
		for (var i = len; i > 0; --i) {
			token += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		return token;
	},
	sendEmail: function (subject, to, content, fromTitle, mergeAppName) {

		var transporter = nodemailer.createTransport(smtpTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // use SSL
			auth: {
				user: 'pandurangarao.vaartha@xcubelabs.com',
				pass: '12345678'
			},
			tls: {
				rejectUnauthorized: false
			}
		}));
		//        // setup e-mail data with unicode symbols
		var sub = "";
		if (typeof mergeAppName != 'undefined' && mergeAppName == false) {
			sub = subject;
		} else {
			sub = process.env.APP_NAME + " : " + subject;
		}
		var mailOptions = {
			from: process.env.APP_NAME + ".io <" + process.env.EMAIL_USERNAME + ">", // sender address
			to: to, // list of receivers
			subject: sub, // Subject line
			html: content // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});

	},
}


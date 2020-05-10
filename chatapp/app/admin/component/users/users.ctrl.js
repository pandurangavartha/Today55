var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var helper = require('../../../helpers/_helpers');
var userRoles = require('../masterData/masterData.ctrl')
var asyncLoop = require('node-async-loop');
var swig = require('swig');

module.exports = {
    /**
    * @swagger
    * paths:
    *   /user/register:
    *     post:
    *       summary: User Register
    *       description: User Register
    *       tags: [Users]
    *       parameters:
    *         - name: body
    *           description: Register User
    *           in: "body"
    *           required: true
    *           schema:
    *             $ref: "#/definitions/user"
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: user registered successfully
    *         400:
    *           description: exception for required fieleds and validation
    * definitions:
    *   user:
    *     type: object
    *     required:
    *       - name
    *       - email
    *       - password
    *     properties:
    *         name:
    *           type: string
    *           example: panduranga
    *         email:
    *           type: email
    *           example: pandu@gmail.com
    *         firstname:
    *           type: string
    *           example: 'pandu'
    *         lastname:
    *           type: string
    *           example: 'ranga'
    *         password:
    *           type: string
    *           example: '123456'
    *         user_ph_no:
    *           type: string
    *           example: '1234567890'
    * 
    */
    registerUsers: function (req, res) {
        var postData = req.body
        if (typeof postData.email != 'undefined' && postData.email != '' && typeof postData.password != 'undefined' && postData.password != '') {
            var condition = {
                email: postData.email
            }
            models.users.findOne(condition).exec(async function (err, data) {
                if (typeof data != 'undefined' && data != '' && data != null) {
                    res.status(200).json({
                        status: "success",
                        result: "User alredy Existed"
                    })
                } else {
                    postData.ip = req.ip;
                    postData.password = bcrypt.hashSync(postData.password);
                    if (postData.role_id == undefined) {
                        await models.Roles.find({}).exec(function (err, data) {
                            postData.role_id = data[2]._id
                        })
                    }
                    models.users(postData).save().then(function (result) {
                        let temp = {}
                        temp.company_id = postData.company_id;
                        temp.user_id = result._id;
                        models.companyusers(temp).save().then(function (cmpusrdata) {
                            result = _.omit(result.toObject(), 'password');
                            res.status(200).json({
                                status: "success",
                                result: result
                            })
                        })
                    }).catch(function (err) {
                        res.status(200).json({
                            status: false,
                            error: err
                        })
                    })
                }
            })
        } else {
            res.send({
                message: 'some fields are missing',
                sucess: false
            })
        }
    },
    getUsers: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.users.findOne(condition).exec(function (err, result) {
            if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
    compnyUsers: function (req, res) {
        if (req.params.company_id == 4) {
            return res.status(200).json({
                status: "success",
                result: []
            })
        }
        var condition = {
            company_id: {
                $ne: undefined
            },
            company_id: req.params.company_id
        }
        models.companyusers.find(condition).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'added_by'

        }).exec(function (err, result) {
            var finalResult = []
            if (result != null) {
                asyncLoop(result, async function (eachCompany, next) {
                    if (typeof eachCompany != 'undefined' && eachCompany != '') {
                        if (eachCompany.user_id != null) {
                            await models.Roles.find({
                                _id: eachCompany.user_id.role_id
                            }).exec(function (err, result) {
                                eachCompany.user_id.role_id = result[0]
                            })
                        }
                    }
                    if (eachCompany != undefined && eachCompany.user_id != undefined && eachCompany.user_id != null) {
                        finalResult.push(eachCompany)
                    }
                    next()
                },
                    function () {
                        if (result) {
                            res.status(200).json({
                                status: "success",
                                result: finalResult
                            })
                        } else {
                            res.status(200).json({
                                status: false,
                                error: "No records !"
                            })
                        }
                    })
            }
        })
    },
    getAllUsers: function (req, res) {
        models.companyusers.find({
            company_id: {
                $ne: null
            },
        }).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'added_by'

        }).exec(function (err, result) {
            if (result != null) {
                var finalResult = []
                asyncLoop(result, async function (eachCompany, next) {
                    if (typeof eachCompany != 'undefined' && eachCompany != '') {
                        if (eachCompany.user_id != null) {
                            await models.Roles.find({
                                _id: eachCompany.user_id.role_id
                            }).exec(function (err, result) {
                                eachCompany.user_id.role_id = result[0]

                            })
                        }
                    }
                    if (eachCompany != undefined && eachCompany.user_id != null) {
                        finalResult.push(eachCompany)
                    }
                    next()
                },
                    function () {
                        finalResult = _.unionBy(finalResult, 'user_id.email');
                        if (finalResult) {
                            res.status(200).json({
                                status: "success",
                                result: finalResult
                            })
                        } else {
                            res.status(200).json({
                                status: false,
                                error: "No records !"
                            })
                        }
                    })
            }
        })
        // models.users.find({
        //     // _id: {
        //     //     $ne: requestUserId
        //     // },
        // }).populate({
        //     path: 'role_id'

        // }).populate({
        //     path: 'company_id'

        // }).exec(async function (err, result) {
        //     if (err) {
        //         res.status(200).json({
        //             status: false,
        //             error: err
        //         })
        //     } else if (result) {
        //         res.status(200).json({
        //             status: "success",
        //             result: result
        //         })
        //     } else {
        //         res.status(200).json({
        //             status: false,
        //             error: "No records !"
        //         })
        //     }
        // })
    },
    editUsers: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        var updateData = req.body
        delete updateData.email
        models.users.findOneAndUpdate(condition, updateData, {
            new: true
        }).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
    deleteUsers: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.users.findOne(condition).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                models.companyusers.remove({ user_id: req.params.id }).then(function () {
                    models.groupUsers.remove({ user_id: req.params.id }).then(function (obj) {
                        models.users.remove(condition).then(function () {
                            res.status(200).json({
                                status: "success",
                                message: "User deleted successfully"
                            })
                        })
                    })
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },

    /**
	 * @swagger
	 * paths:
	 *   /user/login:
	 *     post:
	 *       summary: User Login
	 *       description: User Login
	 *       tags: [Users]
	 *       parameters:
	 *         - name: body
	 *           description: Login User
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/userLogin"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: user registered successfully
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   userLogin:
	 *     type: object
	 *     required:
	 *       - email
     *       - password
	 *     properties:
	 *         email:
     *           type: email
	 *           example: pandu@gmail.com
     *         password:
     *           type: string
	 *           example: '123456'
     * 
	 */
    login: function (req, res) {
        //        var type = req.body.type;
        var requiredParams = ['email', 'password'];
        helper.validateRequiredParams(req, res, requiredParams).then(function (response) {
            var modelName = models.users;
            var condition = {
                email: req.body.email
            }
            var fields = [""];
            console.log(req.body, 'req.body');
            modelName.findOne(condition).populate({
                path: 'role_id'

            }).select(fields).exec(function (err, data) {
                if (typeof data != 'undefined' && data != '' && data != null) {
                    if (typeof data.password != 'undefined' && (data.password != '' || data.password != null)) {
                        var result = bcrypt.compareSync(req.body.password, data.password);
                        if (result) {
                            /*
                             * JWT token generation
                             */
                            var token = jwt.sign(data, process.env.JWT_SECRET_KEY);
                            res.setHeader('x-access-token', token);
                            var response = [];
                            // data.token = token
                            // response.data = data;
                            return res.json({
                                success: true,
                                data: data,
                                token: token
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: 'Invalid password.'
                            });
                        }
                    }
                } else {
                    return res.json({
                        success: false,
                        message: 'user not existed'
                    });
                }

            }).catch(function (error) {
                helper.formatResponse('', res, error);
            });
        });
    },
    Sociallogin: function (req, res) {
        var input = req.body;
        console.log("-------", input)
        if (typeof input.email != 'undefined' && typeof input.media_type != 'undefined') {
            var modelName = models.users;
            var condition = {
                email: req.body.email
            }
            var fields = [""];
            console.log(req.body, 'req.body');
            modelName.findOne(condition).select(fields).exec(function (err, loginCheck) {
                console.log("loginCheck", loginCheck)
                if (loginCheck != null) {
                    //already exist

                    var user = loginCheck;
                    if (typeof user.social == "undefined")
                        user.social = {};
                    if (input.media_type == "google") {
                        if (typeof user.social.google != "undefined" && user.social.google != input.media_unique_id) {
                            return res.json({
                                success: false,
                                message: 'Invalid media id.'
                            });
                        } else {
                            user.social.google = input.media_unique_id;
                        }

                    } else if (input.media_type.toString().toLowerCase() == "linkedin") {
                        if (typeof user.social.linkedin != "undefined" && user.social.linkedin != input.media_unique_id) {
                            return res.json({
                                success: false,
                                message: 'Invalid media id.'
                            });
                        } else {
                            user.social.linkedin = input.media_unique_id;
                        }

                    } else {
                        return res.json({
                            success: false,
                            message: 'Invalid media type.'
                        });
                    }
                    user.isActive = true;
                    var condition = {
                        _id: loginCheck._id
                    }
                    models.users.findOneAndUpdate(condition, user, {
                        new: true
                    }).exec(function (err, userDetail) {
                        //                    modelName.findOne({_id : loginCheck._id}).then(function(obj){
                        //                            obj.update(user).run().then(function (userDetail) {
                        var token = jwt.sign(userDetail, process.env.JWT_SECRET_KEY);
                        res.setHeader('x-access-token', token);
                        return res.json({
                            success: true,
                            message: 'Login successful.',
                            user: userDetail
                        });
                        //});
                    }).catch(function (err) {
                        res.status(200).json({
                            status: false,
                            error: err
                        })
                    })

                } else {
                    console.log("[[[[[[[[[[[[[[[[[")
                    var newUser = {};
                    //userSignup-social
                    newUser.name = input.name;
                    newUser.email = input.email;
                    newUser.firstname = input.firstname;
                    newUser.lastname = input.lastname;
                    newUser.isActive = true;
                    newUser.social = {};
                    if (input.media_type == "google") {
                        newUser.social.google = input.media_unique_id;
                    } else if (input.media_type.toString().toLowerCase() == "linkedin") {
                        newUser.social.linkedin = input.media_unique_id;
                    } else {
                        return res.json({
                            success: false,
                            message: 'Invalid media type.'
                        });
                    }
                    console.log("======123", newUser)
                    var user = models.users(newUser);
                    console.log("======", user)
                    user.save().then(function (userDetail) {
                        var token = jwt.sign(userDetail, process.env.JWT_SECRET_KEY);
                        res.setHeader('x-access-token', token);
                        return res.json({
                            success: true,
                            user: userDetail,
                            message: 'Login successful.'
                        });
                    }).catch(function (err) {
                        res.status(200).json({
                            status: false,
                            error: err
                        })
                    })
                }
            }).catch(function (error) {
                helper.formatResponse('', res, error);
            });
        } else {
            return res.json({
                success: false,
                message: 'Payload error.'
            });
        }
    },
    notificationUpdate: function (req, res) {
        var condition = {
            sendr_id: req.params.s_id,
            recer_id: req.params.r_id
        }
        let msg = req.params.msg
        models.sndrrecrMsg.findOne(condition).exec(function (err, obj) {
            if(msg != 0){
                msg = obj.notification_count - msg
            }
            models.sndrrecrMsg.findOneAndUpdate(condition, { notification_count: msg }, {
                new: true
            }).exec(function (err, result) {
                if (err) {
                    res.status(200).json({
                        status: false,
                        error: err
                    })
                } else if (result) {
                    res.status(200).json({
                        status: "success",
                        result: result
                    })
                } else {
                    res.status(200).json({
                        status: false,
                        error: "No records !"
                    })
                }
            })
        })
    },
    compnyUserslist: function (req, res) {
        models.companyusers.find({ company_id: req.params.company_id }).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
    /**
        * @swagger
        * paths:
        *   /user/forgotPassword:
        *     post:
        *       summary: User forgotPassword
        *       description: User forgotPassword
        *       tags: [Users]
        *       parameters:
        *         - name: body
        *           description: forgotPassword User
        *           in: "body"
        *           required: true
        *           schema:
        *             $ref: "#/definitions/userforgotPassword"
        *       produces:
        *         - application/json
        *       responses:
        *         200:
        *           description: Link sent successfully
        *         400:
        *           description: exception for required fieleds and validation
        * definitions:
        *   userforgotPassword:
        *     type: object
        *     required:
        *       - email
        *     properties:
        *         email:
        *           type: email
        *           example: pandu@gmail.com
        * 
        */
    forgotPassword: function (req, res) {
        var data = req.body;
        if (typeof data.email != 'undefined') {
            models.users.find({ email: data.email }).exec(function (err, detailCheck) {
                if (detailCheck.length > 0) {
                    /*Send activation link*/
                    // var user = detailCheck[0];
                    // user.forgotPasswordCode = helper.generateRandomString(20);
                    // new Buffer(helper.generateRandomString(20) + "|**|" +
                    let code_send = helper.generateRandomString(5)
                    models.users.findOneAndUpdate({ _id: detailCheck[0]._id },
                        { ver_code: code_send }, {
                            new: true
                        }).exec(function (err, result) {
                            var link = process.env.CONTENT_URL_PASSWORD + result._id;
                            var message = swig.renderFile(__dirname + '/../../../../emailTemplates/account/forgotPassword.html', {
                                user: result,
                                link: link,
                                code: code_send,
                                path: process.env.CONTENT_URL_PASSWORD,
                                appName: 'Team Work Chat'
                            });
                            helper.sendEmail("change your account password", result.email, message, 'Account');
                            return res.json({
                                success: true,
                                message: 'Link has been sent.',
                            });
                        })
                } else {
                    return res.json({
                        success: false,
                        message: 'Invalid email'
                    });
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Payload error.'
            });
        }
    },
    /**
	 * @swagger
	 * paths:
	 *   /user/updatePassword:
	 *     post:
	 *       summary: User updatePassword
	 *       description: User updatePassword
	 *       tags: [Users]
	 *       parameters:
	 *         - name: body
	 *           description: updatePassword User
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/updatePassword"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: password updated successfully
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   updatePassword:
	 *     type: object
	 *     required:
	 *       - code
     *       - conformpassword
     *       - password
	 *     properties:
	 *         code:
     *           type: string
	 *           example: 12ert5
     *         conformpassword:
     *           type: string
	 *           example: 123456
     *         password:
     *           type: string
	 *           example: 123456
     * 
	 */
    updatePassword: function (req, res) {
        var condition = {
            _id: req.body._id
        }
        var updateData = req.body
        models.users.find({ ver_code: updateData.code }).exec(function (err, detailCheck) {
            if (detailCheck != null && detailCheck.length > 0 && detailCheck !== undefined) {
                if (updateData.code !== undefined && updateData.code !== '' && updateData.password != '' && updateData.password !== undefined) {
                    if (updateData.code !== undefined && updateData.code === detailCheck[0].ver_code) {
                        if (updateData.password != '' && updateData.password !== undefined) {
                            updateData.password = bcrypt.hashSync(updateData.password);
                            models.users.findOneAndUpdate(condition, updateData, {
                                new: true
                            }).exec(function (err, result) {
                                if (err) {
                                    res.status(200).json({
                                        status: false,
                                        error: err
                                    })
                                } else if (result) {
                                    res.status(200).json({
                                        status: "success",
                                        result: result
                                    })
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        error: "No records !"
                                    })
                                }
                            })
                        } else {
                            res.status(200).json({
                                status: "false",
                                message: 'password not matched'
                            })
                        }
                    } else {
                        res.status(200).json({
                            status: "false",
                            message: 'code not matched'
                        })
                    }
                } else {
                    res.status(200).json({
                        status: "false",
                        message: 'fields not null'
                    })
                }
            } else {
                res.status(200).json({
                    status: "false",
                    message: 'user not exists'
                })
            }
        })
    },
    /**
   * @swagger
   * paths:
   *   /user/changePassword:
   *     post:
   *       summary: User changePassword
   *       description: User changePassword
   *       tags: [Users]
   *       parameters:
   *         - name: body
   *           description: changePassword User
   *           in: "body"
   *           required: true
   *           schema:
   *             $ref: "#/definitions/changePassword"
   *       produces:
   *         - application/json
   *       responses:
   *         200:
   *           description: password updated successfully
   *         400:
   *           description: exception for required fieleds and validation
   * definitions:
   *   changePassword:
   *     type: object
   *     required:
   *       - oldpassword
   *       - conformpassword
   *       - password
   *     properties:
   *         oldpassword:
   *           type: string
   *           example: 123456
   *         conformpassword:
   *           type: string
   *           example: 123456
   *         password:
   *           type: string
   *           example: 123456
   * 
   */
    changePassword: function (req, res) {
        var condition = {
            _id: req.body._id
        }
        var updateData = req.body
        models.users.find({ _id: req.body._id }).exec(function (err, detailCheck) {
            if (detailCheck != null && detailCheck.length > 0 && detailCheck !== undefined) {
                if (updateData.oldpassword != '' && updateData.password !== undefined) {
                    if (bcrypt.compareSync(updateData.oldpassword, detailCheck[0].password)) {
                        updateData.password = bcrypt.hashSync(updateData.password);
                        models.users.findOneAndUpdate(condition, updateData, {
                            new: true
                        }).exec(function (err, result) {
                            if (err) {
                                res.status(200).json({
                                    status: false,
                                    error: err
                                })
                            } else if (result) {
                                res.status(200).json({
                                    status: "success",
                                    result: result
                                })
                            } else {
                                res.status(200).json({
                                    status: false,
                                    error: "No records !"
                                })
                            }
                        })
                    } else {
                        res.status(200).json({
                            status: "false",
                            message: "password miss matched"
                        })
                    }
                } else {
                    res.status(200).json({
                        status: "false",
                        message: "fields are empty"
                    })
                }
            } else {
                res.status(200).json({
                    status: "false",
                })
            }
        })
    },
}
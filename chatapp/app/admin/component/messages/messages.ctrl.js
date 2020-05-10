var mongoose = require('mongoose');
var Base64 = require('base-64');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var helper = require('../../../helpers/_helpers');
const multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');

module.exports = {
    /**
	 * @swagger
	 * paths:
	 *   /adduser/to/company:
	 *     post:
	 *       summary: adduser Company
	 *       description: adduser Company
	 *       tags: [Message]
	 *       parameters:
	 *         - name: body
	 *           description: adduser Company
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/addusertocompany"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Success add Company
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   addusertocompany:
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
	 *         company_id:
     *           type: string
	 *           example: '123456'
     *         role_id:
     *           type: string
	 *           example: 'Admin'         
	 */
    addusertocompany: function (req, res) {
        var postData = req.body
        console.log('---', postData)
        if (typeof postData.email != 'undefined' && postData.email != '' && typeof postData.password != 'undefined' && postData.password != '') {
            var condition = {
                email: postData.email
            }
            models.users.findOne(condition).exec(async function (err, data) {
                if (typeof data != 'undefined' && data != '' && data != null) {
                    res.status(200).json({
                        status: "false",
                        result: "User alredy Existed"
                    })
                } else {
                    postData.ip = req.ip;
                    postData.logged_in = false
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
                        if (requestUserId != undefined && requestUserId != null) {
                            temp.added_by = requestUserId;
                        }
                        models.companyusers(temp).save().then(function (cmpusrdata) {
                            io.emit('refreshUserDropDowninGroup', result)
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


    /**
    * @swagger
    * paths:
    *   /messages/send:
    *     post:
    *       summary: messages send
    *       description: messages send
    *       tags: [Message]
    *       parameters:
    *         - name: body
    *           description: messages send
    *           in: "body"
    *           required: true
    *           schema:
    *             $ref: "#/definitions/messages"
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: Success add Company
    *         400:
    *           description: exception for required fieleds and validation
    * definitions:
    *   messages:
    *     type: object
    *     required:
    *       - group_id
    *       - company_id
    *       - messages
    *       - recer_id
    *     properties:
    *         group_id:
    *           type: string
    *           example: '12345'
    *         company_id:
    *           type: string
    *           example: '123456'
    *         messages:
    *           type: string
    *           example: '123456'
    *         recer_id:
    *           type: string
    *           example: '12345'         
    */
    addMessages: function (req, res) {
        var postData = {};
        postData.user_id = requestUserId;
        postData.sendr_id = requestUserId;
        postData.recer_id = req.body.recer_id;
        postData.messages = req.body.messages;
        postData.company_id = req.body.company_id;
        postData.isRead = false;
        postData.type = 'normal'
        if (req.body.type == 'group') {
            postData.type = 'group'
            postData.group_id = req.body.group_id
        }
        if (typeof postData.recer_id != 'undefined' && postData.recer_id != '' && typeof postData.messages != 'undefined' && postData.messages != '') {
            models.messages(postData).save().then(function (result) {
                io.emit('sendMessage', result)
                io.emit("chat", req.body)
                res.status(200).json({
                    status: "success",
                    result: result
                })
            }).catch(function (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            })
        } else {
            res.send({
                message: 'some fields are missing',
                sucess: false
            })
        }
    },


    addimages: function (req, res) {
        var profilePath = 'content/documents';
        const form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            //Check file selected or not
            if (_.isEmpty(files)) {
                // return Promise.resolve(response.send(400, 'No files were uploaded.', err, req, res));
                res.status(200).json({
                    status: false,
                    message: "No files were uploaded"
                })
            }
            _.each(files.image, async function (profilePic) {
                _.each(fields, function (val, key) {
                    req.body[key] = val[0];
                });
                var input = req.body;
                var tmpPath = profilePic.path;
                var name = (profilePic.originalFilename).split('.')[0];
                var ext = path.extname(profilePic.originalFilename);
                imageName = (name + ext);
                var targetPath = profilePath + '/' + imageName;
                var size = (profilePic.size / (1024 * 1024)).toFixed(2);

                fs.readFile(tmpPath, function (err, data) {
                    fs.writeFile(targetPath, data, function (err) {
                        if (err)
                            console.error(err.stack);
                        var TaskDocCreate = {};
                        TaskDocCreate.document_name = profilePic.originalFilename;
                        TaskDocCreate.document_path = targetPath;
                        TaskDocCreate.document_url = process.env.CONTENT_URL + targetPath;
                        TaskDocCreate.document_size = size;
                        TaskDocCreate.recer_id = input.recer_id
                        TaskDocCreate.group_id = input.group_id
                        TaskDocCreate.sendr_id = input.sndr_id
                        TaskDocCreate.company_id = input.company_id
                        TaskDocCreate.user_id = input.user_id
                        TaskDocCreate.type = input.type
                        models.messages(TaskDocCreate).save().then(function (result) {
                            res.status(200).json({
                                status: "success",
                                result: result
                            })
                        }).catch(function (err) {
                            res.status(200).json({
                                status: false,
                                error: err
                            })
                        })
                    })
                })
            })
        })
    },


    /**
    * @swagger
    * paths:
    *   /messages/get/{recvrid}:
    *     get:
    *       summary: messages Details
    *       description: messages Details
    *       tags: [Message]
    *       parameters:
    *        - name: "x-access-token"
    *          in: "header"
    *          required: true
    *          type: "string"
    *        - name: recvrid
    *          description: user id
    *          in: path
    *          type: string
    *          required: true
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: Successfully returned Details
    *         400:
    *           description: exception for required fieleds and validation
    *         
    */
    getMessagesDetails: function (req, res) {
        let page_num = (req.params.page == undefined ? 0 : req.params.page)
        let page_size = 10 * (parseInt(page_num) + 1)
        let skips = page_size * (page_num - 1)
        let countNum = 0
        let isbottom = req.params.isbottom
        console.log('-------------', skips, page_size, page_num)
        // cursor = db['students'].find().skip(skips).limit(page_size)
        // db.students.find({ '_id': { '$gt': last_id } }).limit(10)
        // users = db.users.find({ '_id'> last_id }).limit(10);
        var condition = {
            sendr_id: requestUserId,
            recer_id: req.params.recvrid
        }
        let Checkcount = 0
        models.sndrrecrMsg.findOne(condition).exec(function (err, result1) {
            let ArrData = result1
            // console.log('--------result1--------', result1)
            if (result1 != undefined && result1.notification_count != undefined && result1.notification_count != 0) {
                Checkcount = ArrData.notification_count
                let SiZe = 0
                if (isbottom != undefined && isbottom == 1) {
                    if (result1.notification_count <= 10) {
                        result1.notification_count = result1.notification_count
                        SiZe = result1.notification_count
                        page_size = SiZe;
                        countNum = result1.notification_count
                        console.log('-----1-------', page_size)
                        if (result1.notification_count <= 10 && page_num > 0) {
                            result1.notification_count = result1.notification_count
                            SiZe = result1.notification_count
                            page_size = SiZe + page_size;
                            countNum = result1.notification_count
                            console.log('-----1-1------', page_size)
                        }
                    } else {
                        let val = (result1.notification_count - 10)
                        result1.notification_count = result1.notification_count - val
                        SiZe = result1.notification_count + 10
                        page_size = SiZe;
                        countNum = result1.notification_count
                        console.log('-----2-------', page_size)
                        if (result1.notification_count >= 10 && page_num > 0) {
                            let val = (result1.notification_count - 10)
                            result1.notification_count = result1.notification_count - val
                            SiZe = result1.notification_count
                            page_size = SiZe + page_size;
                            countNum = result1.notification_count
                            console.log('-----21-------', page_size)
                        }
                    }
                } else {
                    if (result1.notification_count < 10) {
                        if (page_num > 0) {
                            SiZe = result1.notification_count + (10 - result1.notification_count) + page_size
                        } else {
                            SiZe = result1.notification_count + (10 - result1.notification_count)
                        }
                        // + (10 - result.group_noti_count)
                    } else {
                        if (page_num > 0) {
                            let val = (result1.notification_count - 10)
                            result1.notification_count = result1.notification_count - val
                            SiZe = (4 + result1.notification_count) + page_size
                        } else {
                            let val = (result1.notification_count - 10)
                            result1.notification_count = result1.notification_count - val
                            SiZe = (4 + result1.notification_count) + page_size +10
                        }
                    }
                    page_size = SiZe;
                    countNum = result1.notification_count
                    console.log('-----3-------', page_size)
                }
            }
            console.log('------------', page_size)
            if (Checkcount >= 10) {
                page_size = page_size + countNum
            } else {
                page_size = page_size
            }
            models.messages.find({
                "$or": [{
                    "$and": [{
                        "sendr_id": mongoose.Types.ObjectId(requestUserId)
                    }, {
                        "recer_id": mongoose.Types.ObjectId(req.params.recvrid)
                    }]
                }, {
                    "$and": [{
                        "sendr_id": mongoose.Types.ObjectId(req.params.recvrid)
                    }, {
                        "recer_id": mongoose.Types.ObjectId(requestUserId)
                    }]
                }]
            }).populate('recer_id', {
                'email': 1,
                'firstname': 1,
                'lastname': 1
            }).populate('sendr_id', {
                'email': 1,
                'firstname': 1,
                'lastname': 1
            }).sort({ $natural: -1 }).limit(page_size).exec(function (err, result) {
                result = result.reverse()
                let FinalArr = []
                FinalArr = result
                console.log('------Checkcount-----', countNum, result.length, Checkcount)
                if (countNum != 0) {
                    let sIdx = 0
                    if (result.length > Checkcount) {
                        sIdx = result.length - Checkcount
                    }
                    // let eIdx = countNum
                    //  result = result.slice(sIdx,result.length)
                    console.log('------sIdx-----', sIdx)
                    if (Checkcount >= 10) {
                        result = result.slice(sIdx, (countNum + sIdx))
                        console.log('------result-----', result.length)
                        if (result.length > 1) {
                            result[0]['msg_unread'] = true
                        }
                        result = _.each(result, function (obj, i) {
                            console.log('----123--------', obj.msg_unread, obj.msg_blue)
                            obj.msg_blue = true
                        })
                        if (page_num > 0) {
                            if (result.length > Checkcount) {
                                let diff = _.differenceBy(FinalArr, result, '_id')
                                console.log('-------234----', diff.length, FinalArr.length, result.length)
                                _.each(result, function (obj) {
                                    diff.push(obj)
                                })
                                result = diff
                            }
                        }

                    } else {
                        result = _.each(result, function (obj, i) {
                            // console.log('=====i >= sIdx===============',i ,sIdx)
                            if (i >= sIdx) {
                                if (i == sIdx) {
                                    obj.msg_unread = true
                                }
                                obj.msg_blue = true
                            }
                        })
                    }

                }
                if (result) {
                    res.status(200).json({
                        status: "success",
                        result: result,
                        countNum: countNum
                    })
                } else {
                    res.status(200).json({
                        status: false,
                        error: "No records !",
                        countNum: countNum
                    })
                }
            })
        })
    },
    /**
	 * @swagger
	 * paths:
	 *   /messages/get/admin/{sendrid}/{recvrid}:
	 *     get:
	 *       summary: messages Details
	 *       description: messages Details
	 *       tags: [Message]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: sendrid
	 *          description: user id
	 *          in: path
	 *          type: string
	 *          required: true
     *        - name: recvrid
	 *          description: user id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    getMessagesDetailsAdminList: function (req, res) {
        models.messages.find({
            "$or": [{
                "$and": [{
                    "sendr_id": mongoose.Types.ObjectId(req.params.sendrid)
                }, {
                    "recer_id": mongoose.Types.ObjectId(req.params.recvrid)
                }]
            }, {
                "$and": [{
                    "sendr_id": mongoose.Types.ObjectId(req.params.recvrid)
                }, {
                    "recer_id": mongoose.Types.ObjectId(req.params.sendrid)
                }]
            }]
        }).populate('recer_id', {
            'email': 1,
            'firstname': 1,
            'lastname': 1
        }).populate('sendr_id', {
            'email': 1,
            'firstname': 1,
            'lastname': 1
        }).exec(function (err, result) {
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

    /**
   * @swagger
   * paths:
   *   /messages/get/users/{recvrid}:
   *     get:
   *       summary: messages Details
   *       description: messages Details
   *       tags: [Message]
   *       parameters:
   *        - name: "x-access-token"
   *          in: "header"
   *          required: true
   *          type: "string"
   *        - name: recvrid
   *          description: user id
   *          in: path
   *          type: string
   *          required: true
   *       produces:
   *         - application/json
   *       responses:
   *         200:
   *           description: Successfully returned Details
   *         400:
   *           description: exception for required fieleds and validation
   *         
   */
    getMessagesDetailsAdmin: function (req, res) {
        models.messages.find({
            recer_id: { $exists: true },
            "$or": [{
                "sendr_id": mongoose.Types.ObjectId(req.params.recvrid)
            }, {
                "recer_id": mongoose.Types.ObjectId(req.params.recvrid)
            }]
        }).populate('recer_id', {
            'email': 1,
            'firstname': 1,
            'lastname': 1,
            // '_id':1
        }).populate('sendr_id', {
            'email': 1,
            'firstname': 1,
            'lastname': 1,
            // '_id':1
        }).exec(function (err, result) {
            let Arr = []
            _.each(result, function (element) {
                if (element.sendr_id != undefined && element.sendr_id._id != req.params.recvrid) {
                    Arr.push(element.sendr_id)
                }
                if (element.recer_id != undefined && element.recer_id._id != req.params.recvrid) {
                    Arr.push(element.recer_id)
                }
            });

            // Arr = _.uniqBy(Arr, ['_id']);
            var _unArray = []; // new array without duplicate
            Arr.forEach(function (item) { // loop through array which contain duplicate
                // if item is not found in _unArray it will return empty array
                var isPresent = _unArray.filter(function (elem) {
                    return (elem.email === item.email)
                })
                if (isPresent.length == 0) {
                    _unArray.push(item)
                }
            })
            if (_unArray) {
                res.status(200).json({
                    status: "success",
                    result: _unArray
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
    *   /messages/count/{sendr_id}/{recer_id}:
    *     get:
    *       summary: messages Details
    *       description: messages Details
    *       tags: [Message]
    *       parameters:
    *        - name: "x-access-token"
    *          in: "header"
    *          required: true
    *          type: "string"
    *        - name: sendr_id
    *          description: user id
    *          in: path
    *          type: string
    *          required: true
    *        - name: recer_id
    *          description: user id
    *          in: path
    *          type: string
    *          required: true
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: Successfully returned Details
    *         400:
    *           description: exception for required fieleds and validation
    *         
    */
    getMsgCount: function (req, res) {
        var condition = {
            sendr_id: req.params.sendr_id,
            recer_id: req.params.recer_id
        }
        models.sndrrecrMsg.find(condition).exec(function (err, result) {
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

    /**
	 * @swagger
	 * paths:
	 *   /messages/delete/{id}:
	 *     delete:
	 *       summary: messages delete
	 *       description: messages delete
	 *       tags: [Message]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: user id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    delete: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.messages.findOneAndUpdate(condition, { isDelete: true, msg_del_by: requestUserId }).exec(function (err, result) {
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
    }

}
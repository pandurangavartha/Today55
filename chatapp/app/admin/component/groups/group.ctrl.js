module.exports = {
    /**
    * @swagger
    * paths:
    *   /group/create:
    *     post:
    *       summary: Group Create
    *       description: Group Create
    *       tags: [Group]
    *       parameters:
    *         - name: body
    *           description: Create Group
    *           in: "body"
    *           required: true
    *           schema:
    *             $ref: "#/definitions/group"
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: Success add Group
    *         400:
    *           description: exception for required fieleds and validation
    * definitions:
    *   group:
    *     type: object
    *     required:
    *       - name
    *       - type
    *     properties:
    *         name:
    *           type: string
    *           example: pandu
    *         type:
    *           type: string
    *           example: 'public'
    *         
    */
    creategroup: async function (req, res) {
        var postData = req.body
        if (typeof postData.name != 'undefined' && postData.name != '') {
            if (typeof postData.company_id == 'undefined') {
                var condition = {
                    user_id: requestUserId,
                    company_id: {
                        $ne: undefined
                    },
                }
                await models.companyusers.find(condition).exec(function (err, resultObj) {
                    postData.company_id = resultObj[0].company_id
                })
            }
            await models.group(postData).save().then(function (result) {
                let temp = {}
                temp.group_id = result._id
                temp.company_id = result.company_id
                temp.created_by = result.created_by
                temp.user_id = result.created_by
                temp.type = result.type
                temp.group_by_type = 'own'
                models.groupUsers(temp).save().then(function (result) {

                })

                if (result.type == 'public') {
                    models.companyusers.find({ company_id: result.company_id }).exec(function (err, allList) {
                        let batch = []
                        allList.forEach(element => {
                            var newKey = {
                                group_id: result._id,
                                user_id: element.user_id,
                                type: result.type,
                                company_id: result.company_id,
                                group_by_type: 'invited'
                            };
                            if (element.user_id != requestUserId) {
                                batch.push(newKey);
                            }
                        });
                        models.groupUsers.insertMany(batch)
                    })
                }
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
    /**
 * @swagger
 * paths:
 *   /owner/get/groups/{created_by}:
 *     get:
 *       summary: Group List
 *       description: Group List
 *       tags: [Group]
 *       parameters:
 *        - name: "x-access-token"
 *          in: "header"
 *          required: true
 *          type: "string"
 *        - name: created_by
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
    getownerGroups: function (req, res) {
        var condition = {
            created_by: req.params.created_by
        }
        models.group.find(condition).populate({
            path: 'created_by'

        }).populate({
            path: 'company_id'

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
  *   /get/allgroups:
  *     get:
  *       summary: Group List
  *       description: Group List
  *       tags: [Group]
  *       parameters:
  *        - name: "x-access-token"
  *          in: "header"
  *          required: true
  *          type: "string"
  *       produces:
  *         - application/json
  *       responses:
  *         200:
  *           description: Successfully returned Details
  *         400:
  *           description: exception for required fieleds and validation
  *         
  */
    getAllgroups: function (req, res) {
        // models.group.find({}).populate({
        //     path: 'created_by'

        // }).populate({
        //     path: 'company_id'

        // }).exec(function (err, result) {
        models.groupUsers.find({}).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'group_id'

        }).exec(async function (err, result1) {
            let result = []
            if (result1.length > 0) {
                await asyncForEach(result1, async function (element) {
                    if (element.group_id != undefined && element.group_id != null) {
                        element['usrsCount'] = await models.groupUsers.find({ group_id: element.group_id }).count();
                        result.push(element)
                        // next()
                    }
                });
            }
            result = _.unionBy(result, 'group_id._id');
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
    *   /group/{id}:
    *     get:
    *       summary: Group Details
    *       description: Group Details
    *       tags: [Group]
    *       parameters:
    *        - name: "x-access-token"
    *          in: "header"
    *          required: true
    *          type: "string"
    *        - name: id
    *          description: group id
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
    getGroupDetails: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.group.findOne(condition).populate({
            path: 'created_by'

        }).exec(async function (err, result) {
            result['usrsCount'] = await models.groupUsers.find({ group_id: result._id }).count();
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
    *   /group/edit/{id}:
    *     get:
    *       summary: Group Edit
    *       description: Group Edit
    *       tags: [Group]
    *       parameters:
    *        - name: "x-access-token"
    *          in: "header"
    *          required: true
    *          type: "string"
    *        - name: id
    *          description: group id
    *          in: path
    *          type: string
    *          required: true
    *        - name: body
    *          description: Create Group
    *          in: "body"
    *          required: true
    *          schema:
    *          $ref: "#/definitions/group"
    *       produces:
    *         - application/json
    *       responses:
    *         200:
    *           description: Successfully returned Details
    *         400:
    *           description: exception for required fieleds and validation
    *         
    */
    editGroup: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        var updateData = req.body
        models.group.findOneAndUpdate(condition, updateData, {
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
    /**
	 * @swagger
	 * paths:
	 *   /group/delete/{id}:
	 *     delete:
	 *       summary: Group Delete
	 *       description: Group Delete
	 *       tags: [Group]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: group id
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
    deleteGroup: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.group.findOne(condition).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                models.group.remove(condition).then(function () {
                    models.groupUsers.remove({ group_id: req.params.id }).then(function (obj) {
                        res.status(200).json({
                            status: "success",
                            message: "Company deleted successfully"
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
        // var condition = {
        //     _id: req.params.id
        // }
        // models.group.findOne(condition).exec(function (err, result) {
        //     if (err) {
        //         res.status(200).json({
        //             status: false,
        //             error: err
        //         })
        //     } else if (result) {
        //         models.group.remove(condition).then(function () {
        //             res.status(200).json({
        //                 status: "success",
        //                 message: "Company deleted successfully"
        //             })
        //         })
        //     } else {
        //         res.status(200).json({
        //             status: false,
        //             error: "No records !"
        //         })
        //     }
        // })
    },
    /**
	 * @swagger
	 * paths:
	 *   /add/user/to/group:
	 *     post:
	 *       summary: ADD user to group
	 *       description: ADD user to group
	 *       tags: [Group]
	 *       parameters:
	 *         - name: body
	 *           description: ADD user to group 
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/addusergroup"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Success add Group
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   addusergroup:
	 *     type: object
	 *     required:
	 *       - group_id
     *       - user_id
	 *     properties:
	 *         group_id:
     *           type: string
	 *           example: pandu
	 *         user_id:
     *           type: string
	 *           example: 'public'
	 *         
	 */
    addUserToGroup: function (req, res) {
        var postData = req.body
        postData.group_by_type = 'invited'
        if (typeof postData.user_id != 'undefined' && postData.user_id != '') {
            var condition = {
                group_id: postData.group_id,
                user_id: postData.user_id
            }
            // console.log('------condition-----', condition)
            models.groupUsers.findOne(condition).exec(async function (err, data) {
                if (typeof data != 'undefined' && data != '' && data != null) {
                    res.status(200).json({
                        status: false,
                        result: "User alredy Existed"
                    })
                } else {
                    await models.group.findOne({ _id: postData.group_id }).exec(function (err, result) {
                        postData.type = result.type
                    })
                    models.groupUsers(postData).save().then(function (result) {
                        var condition = {
                            _id: result._id
                        }
                        models.groupUsers.find(condition).populate({
                            path: 'user_id'

                        }).populate({
                            path: 'company_id'

                        }).populate({
                            path: 'group_id', populate: { path: 'created_by' }

                        }).exec(function (err, result1) {
                            io.emit('sendInvitationToUser', { result: result1[0], user_id: condition.user_id, add_by: requestUserId })

                            let tempAdd = {}
                            tempAdd.company_id = result.company_id
                            tempAdd.sendr_id = requestUserId
                            tempAdd.group_id = result.group_id
                            tempAdd.type = 'group'
                            tempAdd.messages = ''
                            tempAdd.user_added = result1[0].user_id.email
                            models.messages(tempAdd).save()
                        })
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
        *   /ger/userlist/{g_id}:
        *     get:
        *       summary: Group userlist
        *       description: Group userlist
        *       tags: [Group]
        *       parameters:
        *        - name: "x-access-token"
        *          in: "header"
        *          required: true
        *          type: "string"
        *        - name: g_id
        *          description: group id
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
    getGroupUsersList: function (req, res) {
        var condition = {
            group_id: req.params.g_id
        }
        models.groupUsers.find(condition).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'created_by'

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
        *   /get/invited/groups/{u_id}:
        *     get:
        *       summary: Group inviteduserlist
        *       description: Group inviteduserlist
        *       tags: [Group]
        *       parameters:
        *        - name: "x-access-token"
        *          in: "header"
        *          required: true
        *          type: "string"
        *        - name: u_id
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
    getInvitedlist: async function (req, res) {
        var condition = {
            user_id: req.params.u_id
        }
        await models.groupUsers.find({ user_id: req.params.u_id }).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'group_id', populate: { path: 'created_by' }

        }).exec(async function (err, result1) {
            let result = []
            if (result1.length > 0) {
                // result1.forEach(async element => {
                // asyncLoop(result1, async function (element, next) {
                //     if (element.group_id != undefined && element.group_id != null) {
                //         element['usrsCount'] =  await models.groupUsers.find({ group_id: element.group_id }).count();
                //        await result.push(element)
                //         next()
                //     }
                // }, function () {
                await asyncForEach(result1, async function (element) {
                    if (element.group_id != undefined && element.group_id != null) {
                        element['usrsCount'] = await models.groupUsers.find({ group_id: element.group_id }).count();
                        result.push(element)
                        // next()
                    }
                });
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
                // })
            }
        })
    },
    /**
        * @swagger
        * paths:
        *   /get/groupchat/{g_id}:
        *     get:
        *       summary: Group groupchat
        *       description: Group groupchat
        *       tags: [Group]
        *       parameters:
        *        - name: "x-access-token"
        *          in: "header"
        *          required: true
        *          type: "string"
        *        - name: g_id
        *          description: group id
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
    getGroupChatBygroupid: function (req, res) {

        models.groupUsers.findOne({ group_id: req.params.g_id, user_id: requestUserId })
            .exec(function (err, result) {
                let countNum = 0
                let page_num = (req.params.page == undefined ? 0 : req.params.page)
                let page_size = 10 * (parseInt(page_num) + 1)
                let skips = page_size * (page_num - 1)
                if (result != undefined && result != null && result.group_noti_count != undefined && result.group_noti_count != 0) {
                    let SiZe = 0
                    if (result.group_noti_count < 10) {
                        SiZe = result.group_noti_count + 4
                        // + (10 - result.group_noti_count)
                    } else {
                        SiZe = result.group_noti_count + 4
                    }
                    page_size = SiZe;
                    countNum = result.group_noti_count
                    console.log('-----1-------', page_size)
                }
                console.log('------------', page_size)
                if (result == null && result == undefined) {
                    var condition = {
                        group_id: req.params.g_id
                    }
                } else {
                    if (result.muteDate != undefined && result.muteDate != '') {
                        var condition = {
                            group_id: req.params.g_id,
                            createdAt: { $gt: new Date(result.createdAt), $lt: new Date(result.muteDate) },
                            // createdAt: { $lt: new Date(result.muteDate) }
                        }
                    } else {
                        var condition = {
                            group_id: req.params.g_id,
                            createdAt: { $gt: new Date(result.createdAt) }
                        }
                    }
                }
                models.messages.find(condition).populate({
                    path: 'user_id'

                }).populate({
                    path: 'company_id'

                }).populate({
                    path: 'sendr_id'

                }).populate({
                    path: 'recer_id'

                }).populate({
                    path: 'group_id'

                }).sort({ $natural: -1 }).limit(page_size).exec(function (err, result) {
                    // if(result.length>0){
                    //     result[0].group_noti_count = countNum
                    // }
                    result = result.reverse()
                    if (countNum != 0) {
                        let sIdx = result.length - countNum
                        // let eIdx = countNum
                        // result = result.slice(sIdx,result.length)
                        result = _.each(result, function (obj, i) {
                            // console.log('=====i >= sIdx===============',i ,sIdx)
                            if (i >= sIdx) {
                                if (i == sIdx) {
                                    obj.msg_unread = true
                                }
                                obj.msg_blue = true
                            }
                        })
                        let page = 1
                        let limit = 10
                        let countInnc = 0
                        if (req.params.isbottom > 0) {
                            /* PAGINATION WITH SORTING AND PAGING */
                            page = 1;  // input page, min value 1
                            limit = 10 * req.params.isbottom; // input limit min value 1
                            countInnc = 10 * req.params.isbottom; // input limit min value 1
                        }
                        result = _(result)
                            .drop((page - 1) * limit)   // page in drop function starts from 0
                            .take(limit)                // limit 2
                            .value();
                        console.log('================================', page_size, result.length)
                        // if (countInnc >= result.length) {
                        //     console.log('==================123==============', page_size, result.length)
                        //     countNum = 0
                        //     var condition = {
                        //         user_id: requestUserId,
                        //         group_id: req.params.g_id
                        //     }
                        //     // console.log('++++++++++++condition+++++', condition)
                        //     models.groupUsers.findOneAndUpdate(condition, { group_noti_count: 0 }, {
                        //         new: true
                        //     }).exec(function (err, result) { 
                                
                        //     })
                        // }
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
         *   /delete/group/user/{id}:
         *     delete:
         *       summary: Group user delete
         *       description: Group user delete
         *       tags: [Group]
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
    deleteGroupUser: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.groupUsers.findOne(condition).populate({ path: 'user_id' }).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {

                let tempAdd = {}
                tempAdd.company_id = result.company_id
                tempAdd.sendr_id = requestUserId
                tempAdd.group_id = result.group_id
                tempAdd.type = 'group'
                tempAdd.messages = ''
                tempAdd.user_deleted = result.user_id.email
                models.messages(tempAdd).save()
                models.groupUsers.remove(condition).then(function () {
                    res.status(200).json({
                        status: "success",
                        message: "User deleted successfully"
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
        *   /group/notification/update/{id}:
        *     get:
        *       summary: notification update
        *       description: notification update
        *       tags: [Group]
        *       parameters:
        *        - name: "x-access-token"
        *          in: "header"
        *          required: true
        *          type: "string"
        *        - name: id
        *          description: group id
        *          in: path
        *          type: string
        *          required: true
        *       produces:
        *         - application/json
        *       responses:
        *         200:
        *           description: Success add Group
        *         400:
        *           description: exception for required fieleds and validation
        *         
        */
    groupNotificationUpdate: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        // console.log('++++++++++++condition+++++', condition)
        models.groupUsers.findOneAndUpdate(condition, { group_noti_count: 0 }, {
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

    /**
       * @swagger
       * paths:
       *   /update/group/not/{uid}/{gid}:
       *     get:
       *       summary: notification update
       *       description: notification update
       *       tags: [Group]
       *       parameters:
       *        - name: "x-access-token"
       *          in: "header"
       *          required: true
       *          type: "string"
       *        - name: id
       *          description: group id
       *          in: path
       *          type: string
       *          required: true
       *       produces:
       *         - application/json
       *       responses:
       *         200:
       *           description: Success add Group
       *         400:
       *           description: exception for required fieleds and validation
       *         
       */
    groupNotificationUpdateFromChat: function (req, res) {
        var condition = {
            user_id: req.params.uid,
            group_id: req.params.gid
        }
        // console.log('++++++++++++condition+++++', condition)
        models.groupUsers.findOneAndUpdate(condition, { group_noti_count: 0 }, {
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

    /**
	 * @swagger
	 * paths:
	 *   /mute/notifications/{id}:
	 *     get:
	 *       summary: mute notification update
	 *       description: mute notification update
	 *       tags: [Group]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: group id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Success add Group
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    muteNotification: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        var body = req.body
        // console.log('-------mute----------', req.params.id, body)
        let mutedate;
        mutedate = req.body.isMute == true ? new Date() : ''
        models.groupUsers.findOneAndUpdate(condition, { isMute: body.isMute, muteDate: mutedate }).exec(function (err, result) {
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
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
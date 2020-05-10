// Set socket.io listeners.
var under = require('lodash');

exports = module.exports = function (io) {
    let count = 0
    io.on('connection', (socket) => {

       // groupNotificationCounttoZero
         socket.on('groupNotificationCounttoZero', (conversation) => {
            models.groupUsers.findOneAndUpdate({group_id:conversation.group_id,user_id:conversation.sendr_id}, { group_noti_count: 0 }, {
                new: true
            }).exec(function (err, result) {

            })
         })
        //messageIsRededByUserIGroup1
        socket.on('messageIsRededByUserIGroup1', (conversation) => {
            let temp = {}
            temp.group_id = conversation.group_id
            temp.sendr_id =  conversation.sendr_id 
            temp.isRead = false
            models.messages.update(temp, { $set: { isRead: true } }, { multi: true }).exec(function (err, result1) {
                io.emit('messageIsRededByUserIGroupEmit1', conversation);
            })
        })
        //messageIsRededByUserIGroup
        socket.on('messageIsRededByUserIGroup', (conversation) => {
            let temp = {}
            temp.group_id = conversation.group_id
            temp.sendr_id = { $ne: conversation.sendr_id }
            temp.isRead = false
            models.messages.update(temp, { $set: { isRead: true } }, { multi: true }).exec(function (err, result1) {
                io.emit('messageIsRededByUserIGroupEmit', conversation);
            })
        })

        //messageIsRededByUser
        socket.on('messageIsRededByUser', (conversation) => {
            let temp = {}
            temp.sendr_id = conversation.recer_id
            temp.recer_id = conversation.sender_id
            temp.isRead = false
            // models.messages.find(temp).exec(function (err, result) {
            models.messages.update(temp, { $set: { isRead: true } }, { multi: true }).exec(function (err, result1) {
                io.emit('messageIsRededByUserEmit', temp);
            })
            // })
        })

        //GroupOperatorTyping
        socket.on('GroupOperatorTyping', (conversation) => {
            models.groupUsers.find({ group_id: conversation.group_id, user_id: conversation.sendr_id }).exec(function (err, result) {
                if (result != undefined && result != null && result.length > 0) {
                    result.forEach(element => {
                        if (element.user_id == conversation.sendr_id) {
                            let is_typing_group = element.is_typing_group == undefined ? false : true
                            models.groupUsers.findOneAndUpdate({ _id: element._id }, { is_typing_group: is_typing_group }, {
                                new: true
                            }).exec(function (err, result1) {
                                io.emit('GroupOperatorTypingEmit', result1);
                            })
                        }
                    });
                }
            })
        })

        //GroupOperatorStopTyping
        socket.on('GroupOperatorStopTyping', (conversation) => {
            models.groupUsers.find({ group_id: conversation.group_id, user_id: conversation.sendr_id }).exec(function (err, result) {
                if (result != undefined && result != null && result.length > 0) {
                    result.forEach(element => {
                        if (element.user_id == conversation.sendr_id) {
                            let is_typing_group = element.is_typing_group == undefined ? false : false
                            models.groupUsers.findOneAndUpdate({ _id: element._id }, { is_typing_group: is_typing_group }, {
                                new: true
                            }).exec(function (err, result1) {
                                io.emit('GroupOperatorStopTypingEmit', result1);
                            })
                        }
                    });
                }
            })
        })

        //OperatorTyping
        socket.on('OperatorTyping', (conversation) => {
            models.sndrrecrMsg.find({
                sendr_id: conversation.recer_id,
                recer_id: conversation.sendr_id
            }).exec(function (err, result) {
                if (result != undefined && result != null && result.length > 0) {
                    models.sndrrecrMsg.findOneAndUpdate({
                        sendr_id: conversation.recer_id,
                        recer_id: conversation.sendr_id
                    }, { is_typing: true }, {
                            new: true
                        }).exec(function (err, result5) {
                            io.emit('customerTyping', result5);
                        })
                } else {
                    let temp = {}
                    temp.sendr_id = conversation.recer_id;
                    temp.recer_id = conversation.sendr_id;
                    temp.notification_count = 0;
                    temp.is_typing = true
                    models.sndrrecrMsg(temp).save().then(function (result1) {
                        io.emit('customerTyping', result1);
                    })
                }
            })
        });

        //OperatorStopTyping
        socket.on('OperatorStopTyping', (conversation) => {
            models.sndrrecrMsg.findOneAndUpdate({
                sendr_id: conversation.recer_id,
                recer_id: conversation.sendr_id
            }, { is_typing: false }, {
                    new: true
                }).exec(function (err, result5) {
                    io.emit('customerStopTypingData', result5);
                })
        });


        //privateGroup
        socket.on('privateGroup', (conversation) => {
            io.emit('privateGroupListEmit', conversation.result);
        });

        //publicGroup
        socket.on('publicGroup', (conversation) => {
            io.emit('publicGroupListEmit', conversation.result);
        });

        // deltedUserChtWindownRefresh
        socket.on('deltedUserChtWindownRefresh', (conversation) => {
            io.emit('deltedUserChtWindownRefreshList', conversation);
        });

        // userLoggedOutMultipleAccounts
        socket.on('userLoggedOutMultipleAccounts', (conversation) => {
            io.emit('userLoggedOutMultipleAccountsDelete', conversation);
            models.users.findOneAndUpdate({ _id: conversation }, { logged_in: false }, {
                new: true
            }).exec(function (err, result) {
            })
        });

        // user logged_in
        socket.on('logged_in_session', (conversation) => {
            models.users.findOneAndUpdate({ _id: conversation._id }, { logged_in: true }, {
                new: true
            }).exec(function (err, result) {
            })
        });

        // deltedUserRefreshUsersListinGroup 
        socket.on('deltedUserRefreshUsersListinGroup', (conversation) => {
            io.emit('deltedUserRefreshOnceUsersListinGroup', conversation);
        });

        // Deleted Messages
        socket.on('emitDeletedMsg', (conversation) => {
            io.emit('emitDeletedMsgToUser', conversation);
        });

        //emitDeletedGroupMsg
        socket.on('emitDeletedGroupMsg', (conversation) => {
            io.emit('emitDeletedGroupMsgToUsers', conversation);
        });

        // userAddedIntoGroup
        socket.on('userAddedIntoCompany', (conversation) => {
            io.emit('userAddedIntoCompanylistEmit', conversation);
        });

        // deleteUserfromGroup
        socket.on('deleteUserfromGroup', (conversation) => {
            io.emit('deleteUserfromGroupListEmit', conversation);
        });

        // deleteUserfromGroupData
        socket.on('deleteUserfromGroupData', (conversation) => {
            io.emit('deleteUserfromGroupListEmitlist', conversation);
        });
        // user On line
        socket.on('userLoggedIn', (conversation) => {
            io.emit('user Entered In online', conversation);
            models.users.findOneAndUpdate({ _id: conversation._id }, { online: true }, {
                new: true
            }).exec(function (err, result) {
            })
        });

        // On conversation entry, join broadcast channel
        socket.on('enter conversation', (conversation) => {
            socket.join(conversation);
        });

        socket.on('leave conversation', (conversation) => {
            socket.leave(conversation);
        });

        socket.on('sendMessage', (conversation) => {
            io.emit('EmitMessageTorecevr', conversation);
            // io.emit('EmitMessageTorecevr', conversation)
            var postData = {};
            postData.sendr_id = conversation.sndr_id,
                postData.recer_id = conversation.recer_id,
                postData.messages = conversation.messageText,
                postData.group_id = conversation.group_id,
                postData.type = conversation.type,
                postData.user_id = conversation.user_id,
                postData.company_id = conversation.company_id,
                postData.reply_nm = conversation.reply_nm,
                postData.reply_msg = conversation.reply_msg
            console.log('==========', conversation)
            if (conversation.type == 'group') {
                models.groupUsers.find({ group_id: conversation.group_id, company_id: conversation.company_id }).exec(function (err, result) {
                    if (result != undefined && result != null && result.length > 0) {
                        result.forEach(element => {
                            if (element.user_id != conversation.sndr_id) {
                                let count = element.group_noti_count == undefined ? 0 : (element.group_noti_count + 1)
                                models.groupUsers.findOneAndUpdate({ _id: element._id }, { group_noti_count: count }, {
                                    new: true
                                }).exec(function (err, result) {
                                    io.emit('groupNotificationEmit', result);
                                })
                            }
                        });
                    }
                })
            } else {
                // models.users.find({ _id: conversation.sndr_id }).exec(function (err, result) {
                //     console.log('-----result--------', result)
                //     if (result != undefined && result != null && result.length > 0) {
                //         let count = result[0].notification_count == undefined ? 0 : (result[0].notification_count + 1)
                //         console.log('---111111111111--', count, result)
                //         models.users.findOneAndUpdate({ _id: conversation.sndr_id }, { notification_count: count }, {
                //             new: true
                //         }).exec(function (err, result) {
                //             io.emit('notificationEmit', result);
                //         })
                //     }
                // })
                models.sndrrecrMsg.find({
                    sendr_id: conversation.recer_id,
                    recer_id: conversation.sndr_id
                }).exec(function (err, result) {
                    if (result != undefined && result != null && result.length > 0) {
                        let count = result[0].notification_count == undefined ? 0 : (result[0].notification_count + 1)
                        models.sndrrecrMsg.findOneAndUpdate({
                            sendr_id: conversation.recer_id,
                            recer_id: conversation.sndr_id
                        }, { notification_count: count }, {
                                new: true
                            }).exec(function (err, result5) {
                                io.emit('notificationEmit', result5);

                                // models.users.find({ _id: result5.recer_id }).exec(function (err, result1) {
                                //     console.log("________", result5, result1)
                                //     if (result1.length > 0) {
                                //         let temp = []
                                //         if (result1[0].contacts == undefined && result1[0].contacts.length == 0) {
                                //             result1[0].contacts = []
                                //             temp.push({ contact_id: result5._id })
                                //             temp = under.unionBy(temp, 'contact_id');
                                //             models.users.findOneAndUpdate({ _id: result5.recer_id }, { contacts: temp }, {
                                //                 new: true
                                //             }).exec(function (err, result2) {
                                //                 console.log('----===result2==1==---', result2)
                                //                 io.emit('notificationEmit', result5);
                                //             })
                                //         } else {
                                //             // result1[0].contacts.push({contact_id:result5._id})
                                //             let temp = []
                                //             temp= result1[0].contacts
                                //             temp.forEach(elementOne => {
                                //                 if (elementOne.contact_id != result5._id) {
                                //                     temp.push({contact_id:result5._id})
                                //                     //  result1[0].contacts.push({contact_id:result5._id})                                                
                                //                 }
                                //             });
                                //             console.log(']]]]]]]]]]', temp, result1[0].contacts)
                                //             models.users.findOneAndUpdate({ _id: result5.recer_id }, { contacts: temp }, {
                                //                 new: true
                                //             }).exec(function (err, result2) {
                                //                 console.log('----===result2==1==3---', result2)
                                //             })
                                //         }
                                //     }
                                //     console.log('----===temp==1==---', temp)

                                // })
                            })
                    } else {
                        let temp = {}
                        temp.sendr_id = conversation.recer_id,
                            temp.recer_id = conversation.sndr_id,
                            temp.notification_count = 1
                        models.sndrrecrMsg(temp).save().then(function (result) {
                            io.emit('notificationEmit', result);
                            // models.users.find({ _id: result.recer_id }).exec(function (err, result1) {
                            //     if (result1.length > 0) {
                            //         console.log('-----()----', result1)
                            //         let temp = []
                            //         if (result1[0].contacts == undefined && result1[0].contacts.length == 0) {
                            //             result1[0].contacts = []
                            //             temp.push({ contact_id: result._id })
                            //         } else {
                            //             // result1[0].contacts.push({ contact_id: result._id })
                            //             // temp = result1[0].contacts
                            //             temp= result1[0].contacts
                            //             temp.forEach(elementOne => {
                            //                 if (elementOne.contact_id != result._id) {
                            //                     temp.push({contact_id:result._id})
                            //                     //  result1[0].contacts.push({contact_id:result5._id})                                                
                            //                 }
                            //             });
                            //         }
                            //         console.log('----===temp====---', temp)
                            //         // temp = _.unionBy(temp, 'contact_id');
                            //         models.users.findOneAndUpdate({ _id: result.recer_id }, { contacts: temp }, {
                            //             new: true
                            //         }).exec(function (err, result2) {
                            //             console.log('----===152====---', result2)
                            //         })
                            //     }

                            // })
                        })
                    }
                })

            }

            models.messages(postData).save().then(function (result) {
            })
        });


        socket.on('sendfile', (conversation) => {
            io.emit('EmitMessageTorecevr', conversation.result);
            conversation = conversation.result
            if (conversation != undefined && conversation.sndr_id != undefined) {
                models.users.find({ _id: conversation.sndr_id }).exec(function (err, result) {
                    if (result != undefined && result != null && result.length > 0) {
                        let count = result[0].notification_count == undefined ? 0 : (result[0].notification_count + 1)
                        models.users.findOneAndUpdate({ _id: conversation.sndr_id }, { notification_count: count }, {
                            new: true
                        }).exec(function (err, result) {
                            io.emit('notificationEmit', result);
                        })
                    }
                })
            }
            // io.emit('EmitMessageTorecevr', conversation)
            // console.log('---sendfile--', conversation)
            // conversation = conversation.result
            // var postData = {};
            // postData.sendr_id = conversation.sndr_id,
            //     postData.recer_id = conversation.recer_id,
            //     postData.messages = conversation.messageText,
            //     postData.group_id = conversation.group_id,
            //     postData.type = conversation.type,
            //     postData.user_id = conversation.user_id,
            //     postData.company_id = conversation.company_id,
            // models.messages(postData).save().then(function (result) {
            // console.log('---image--', postData)
            // })
        });

        socket.on('userLoggedOut', (conversation) => {
            console.log('user disconnected', conversation);
            io.emit('user Entered off online', conversation);
            io.emit('LoggedOut', conversation);
            models.users.findOneAndUpdate({ _id: conversation }, { online: false, logged_in: false }, {
                new: true
            }).exec(function (err, result) {
            })
        });
    });
}
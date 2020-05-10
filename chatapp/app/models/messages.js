/* 
 * messages Schema
 */
var messages = new mongoose.Schema({
    messages:{type:String},
    comapny_id: {type: Schema.Types.ObjectId, ref: 'Company'},
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    sendr_id:{type: Schema.Types.ObjectId, ref: 'users'},
    recer_id:{type: Schema.Types.ObjectId, ref: 'users'},
    reply_of_msg_id:{type:String},
    type:{type:String},
    isDelete: {type: Boolean, default: false},
    msg_del_by: {type: Schema.Types.ObjectId, ref: 'users'},
    isRead: {type: Boolean, default: false},
    group_id: {type: Schema.Types.ObjectId, ref: 'group'},
    document_name:{type:String},
    document_url:{type:String},
    document_path:{type:String},
    document_size:{type:String},
    user_added:{type:String},
    user_deleted:{type:String},
    reply_nm:{type:String},
    reply_msg:{type:String},
    msg_blue:{type: Boolean, default: false},
    msg_unread:{type: Boolean, default: false},
},
        {
            timestamps: true,
            versionKey: false
        })
/*
 * defining modelName for Schema
 */
var collectionName = 'messages';
var messages = mongoose.model('messages', messages, collectionName);

module.exports = messages
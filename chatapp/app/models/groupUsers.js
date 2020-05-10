/* 
 * groupUsers Schema
 */
var groupUsers = new mongoose.Schema({
    name:{type:String},
    group_id: {type: Schema.Types.ObjectId, ref: 'group'},
    company_id: {type: Schema.Types.ObjectId, ref: 'Company'},
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    created_by: {type: Schema.Types.ObjectId, ref: 'users'},
    updated_by:{type: Schema.Types.ObjectId, ref: 'users'},
    type: {type: String ,enum : ['public','private'],default: 'public'},
    isDelete: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    group_noti_count:{type: Number,default:0},
    usrsCount:{type: Number,default:0},
    isMute: {type: Boolean, default: false},
    is_typing_group: {type: Boolean, default: false},
    group_by_type: {type: String ,enum : ['own','invited'],default: 'own'},
    muteDate: {type: String}
},
        {
            timestamps: true,
            versionKey: false
        })
/*
 * defining modelName for Schema
 */
var collectionName = 'groupUsers';
var groupUsers = mongoose.model('groupUsers', groupUsers, collectionName);

module.exports = groupUsers
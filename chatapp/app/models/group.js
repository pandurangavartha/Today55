/* 
 * group Schema
 */
var group = new mongoose.Schema({
    name:{type:String},
    company_id: {type: Schema.Types.ObjectId, ref: 'Company'},
    created_by: {type: Schema.Types.ObjectId, ref: 'users'},
    updated_by:{type: Schema.Types.ObjectId, ref: 'users'},
    type: {type: String ,enum : ['public','private'],default: 'public'},
    isDelete: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true}
},
        {
            timestamps: true,
            versionKey: false
        })
/*
 * defining modelName for Schema
 */
var collectionName = 'group';
var group = mongoose.model('group', group, collectionName);

module.exports = group
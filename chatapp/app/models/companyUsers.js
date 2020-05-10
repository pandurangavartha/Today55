/* 
 * Users Schema
 */
var companyusers = new mongoose.Schema({
    company_id:{type: Schema.Types.ObjectId, ref: 'Company'},
    user_id:{type: Schema.Types.ObjectId, ref: 'users'},
    added_by: {type: Schema.Types.ObjectId, ref: 'users'},
},
{
    timestamps: true,
    versionKey : false
})
/*
 * defining modelName for Schema
 */
var collectionName = 'companyusers';
var companyusers = mongoose.model('companyusers', companyusers, collectionName);

module.exports = companyusers


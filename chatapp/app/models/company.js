/* 
 * Company Schema
 */
var Company = new mongoose.Schema({
    name: {type: String},
    email :{type :String,required: true, unique: true,lowercase: true},
    user_id:{type: String},
    ph_no : {type: String}, 
    address: {type: String},
    created_by:{type: Schema.Types.ObjectId, ref: 'users'},
    updated_by:{type: Schema.Types.ObjectId, ref: 'users'},
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},    
},
{
    timestamps: true,
    versionKey : false
})

/*
 * defining modelName for Schema
 */
var collectionName = 'Company';
var Company = mongoose.model('Company', Company, collectionName);

module.exports = Company
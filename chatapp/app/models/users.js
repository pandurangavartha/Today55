/* 
 * Users Schema
 */
var users = new mongoose.Schema({
    name: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    nickname: { type: String },
    ip: { type: String },
    ver_code: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    profilepic: {
        fileName: String,
        fileSize: String,
        folderName: String
    },
    role_id: { type: Schema.Types.ObjectId, ref: 'Roles' },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company' },
    gender: { type: String, length: 1 },
    age: { type: Number, min: 18 },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    user_ph_no: { type: String },
    notification_count: { type: Number, default: 0 },
    online: { type: Boolean, default: false },
    contacts: { type: Array, default: [] },
    logged_in: { type: Boolean, default: true }
},
    {
        timestamps: true,
        versionKey: false
    })
/*
 * defining modelName for Schema
 */
var collectionName = 'users';
var users = mongoose.model('users', users, collectionName);

module.exports = users
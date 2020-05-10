/* 
 * Roles Schema
 */
var Roles = new mongoose.Schema({
    title: {
        type: String
    },
    id: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
})

/*
 * defining modelName for Schema
 */
var collectionName = 'Roles';
var Roles = mongoose.model('Roles', Roles, collectionName);

module.exports = Roles
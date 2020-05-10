/* 
 * messages Schema
 */
var sndrrecrMsg = new mongoose.Schema({
    sendr_id: { type: Schema.Types.ObjectId, ref: 'users' },
    recer_id: { type: Schema.Types.ObjectId, ref: 'users' },
    notification_count: { type: Number, default: 0 },
    is_typing: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    })
/*
 * defining modelName for Schema
 */
var collectionName = 'sndrrecrMsg';
var sndrrecrMsg = mongoose.model('sndrrecrMsg', sndrrecrMsg, collectionName);

module.exports = sndrrecrMsg
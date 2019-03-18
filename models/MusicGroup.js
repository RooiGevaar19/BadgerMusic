//jshint esversion:6, node:true
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MusicGroupSchema = new Schema({
    name: { type: String, required: true },
    songscount: {type: Number, default: 0},
    memberscount: {type: Number, default: 0},
    //songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }], 
    members: [{ type: Schema.Types.ObjectId, ref: 'Account' }], 
    admins: [{ type: Schema.Types.ObjectId, ref: 'Account' }], 
    description: String,
    isGroupPrivate: Boolean,
    isSongsPrivate: Boolean,
    creationDate: Date,
    updatedDate: Date
});

MusicGroupSchema.pre('save', function(next) {
    let currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.creationDate) this.creationDate = currentDate;
    //if (!this.name) this.name = this.username.split("@")[0];
    next();
});

let MusicGroup = mongoose.model('MusicGroup', MusicGroupSchema);

module.exports = MusicGroup;
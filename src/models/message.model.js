    const mongoose = require('mongoose');
    const { Schema } = mongoose;

    const messageSchema = new mongoose.Schema({
        group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        
        text: { type: String },
        attachments: [{
            url: { type: String },
            mimeType: { type: String }
        }],

        readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        deletedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    }, { timestamps: true });

    const Message = mongoose.model('Message', messageSchema);

    module.exports = Message;



import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: Object
    },
    ip: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Log', LogSchema);

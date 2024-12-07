const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    resource: {
        type: String,
        required: true,
        trim: true,
    },
    action: {
        type: [String],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Permission', PermissionSchema);
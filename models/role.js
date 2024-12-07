const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
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
    permissions: [
        {
            permissionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission',
                required: true,
            },
            actions: {
                type: [String],
                required: true,
            },
        },
    ],
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
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Role', RoleSchema);

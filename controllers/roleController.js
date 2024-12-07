const Permission = require("../models/permission");
const Role = require("../models/role");


const createRole = async (req, res) => {
    const { name, description, permissions } = req.body;


    if (!name || !permissions) {
        return res.status(400).json({
            success: false,
            message: 'Name and permissions are required fields',
        });
    }

    try {
        // Check if role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(409).json({
                success: false,
                message: 'Role with this name already exists',
            });
        }

        // Validate the provided permissions
        const validPermissions = await Permission.find({
            _id: { $in: permissions.map(permission => permission.permissionId) }
        });

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: 'Some of the provided permissions are invalid',
            });
        }

        // Create new role
        const newRole = new Role({
            name,
            description,
            permissions,
            createdBy: req.user._id, // Set the creator as the logged-in user
        });

        await newRole.save();

        return res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: newRole,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating role',
        });
    }
};


const getAllRoles = async (req, res) => {
    try {
        // Get roles created by the logged-in user
        const roles = await Role.find({ createdBy: req.user._id })
            .populate({
                path: 'permissions.permissionId',
                select: 'name resource'
            });

        return res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching roles',
        });
    }
};

const updateRole = async (req, res) => {
    const { roleId } = req.params;
    const updateData = req.body;

    try {
        // Find and update the role
        const updatedRole = await Role.findOneAndUpdate(
            { _id: roleId, createdBy: req.user._id }, // Ensure only the creator can update
            updateData,
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found or you do not have permission to update',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating role',
        });
    }
};

const deleteRole = async (req, res) => {
    const { roleId } = req.params;

    try {
        // Find and delete the role
        const deletedRole = await Role.findOneAndDelete(
            { _id: roleId, createdBy: req.user._id } // Ensure only the creator can delete
        );

        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found or you do not have permission to delete',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Role deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting role',
        });
    }
};

module.exports = { createRole, getAllRoles, updateRole, deleteRole };
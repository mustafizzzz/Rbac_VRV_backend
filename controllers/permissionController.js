const Permission = require("../models/permission");


const createPermission = async (req, res) => {
    const { name, description, resource, action } = req.body;

    // Validation: Ensure all required fields are provided
    if (!name || !resource || !action) {
        return res.status(400).json({
            success: false,
            message: 'Name, resource, and action are required fields',
        });
    }

    try {
        // Check if permission already exists
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
            return res.status(409).json({
                success: false,
                message: 'Permission with this name already exists',
            });
        }

        // Create a new permission
        const newPermission = new Permission({
            name,
            description,
            resource,
            action,
        });

        await newPermission.save();

        return res.status(201).json({
            success: true,
            message: 'Permission created successfully',
            data: newPermission,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating permission',
        });
    }
};

// Update an existing permission
const updatePermission = async (req, res) => {
    const { permissionId } = req.params;
    const updateData = req.body;

    // Ensure required fields are provided if updating
    if (updateData.name && !updateData.resource && !updateData.action) {
        return res.status(400).json({
            success: false,
            message: 'Resource and Action are required if updating the name',
        });
    }

    try {
        const updatedPermission = await Permission.findByIdAndUpdate(permissionId, updateData, {
            new: true,
        });

        if (!updatedPermission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Permission updated successfully',
            data: updatedPermission,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating permission',
        });
    }
};

// Delete a permission
const deletePermission = async (req, res) => {
    const { permissionId } = req.params;

    try {
        const deletedPermission = await Permission.findByIdAndDelete(permissionId);

        if (!deletedPermission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Permission deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting permission',
        });
    }
};

// Get all permissions
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();

        return res.status(200).json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching permissions',
        });
    }
};

// Get a single permission by ID
const getPermissionById = async (req, res) => {
    const { permissionId } = req.params;

    try {
        const permission = await Permission.findById(permissionId);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: permission,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching permission',
        });
    }
};

module.exports = {
    createPermission,
    updatePermission,
    deletePermission,
    getAllPermissions,
    getPermissionById,
};

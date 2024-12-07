const express = require('express');
const { verifyJWT } = require('../middleware/auth');
const { createPermission, updatePermission, deletePermission, getAllPermissions, getPermissionById } = require('../controllers/permissionController');



const router = express.Router();

router.route('/permissions/create').post(verifyJWT, createPermission);


router.route('/permissions/:permissionId').put(verifyJWT, updatePermission);


router.route('/permissions/:permissionId').delete(verifyJWT, deletePermission);


router.route('/permissions/get-all').get(verifyJWT, getAllPermissions);

router.route('/permissions/:permissionId').get(verifyJWT, getPermissionById);

module.exports = router;
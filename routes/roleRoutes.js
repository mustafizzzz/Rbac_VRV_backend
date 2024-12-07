const express = require('express');
const { verifyJWT } = require('../middleware/auth');
const { createRole, updateRole, deleteRole, getAllRoles } = require('../controllers/roleController');




const router = express.Router();

router.route('/create').post(verifyJWT, createRole);


router.route('/update/:roleId').put(verifyJWT, updateRole);


router.route('/delete/:roleId').delete(verifyJWT, deleteRole);


router.route('/get-all').get(verifyJWT, getAllRoles);

// router.route('/:roleId').get(verifyJWT, getRoleById);

module.exports = router;
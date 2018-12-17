const router = require('express').Router();
const jwtProtect = require('../../../middlewares/jwtProtect')

router.use('/auth', require('./auth'));

router.use('/todos', jwtProtect, require('./todos'));


module.exports = router;
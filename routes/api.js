var express = require('express');
var router = express.Router();
const apiController = require('../controllers/api.controller');


router.get('/categories', apiController.categories);

module.exports = router;

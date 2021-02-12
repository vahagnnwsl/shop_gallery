var express = require('express');
var router = express.Router();
const apiController = require('../controllers/api.controller');


router.get('/categories', apiController.categories);
router.get('/products', apiController.products);
router.post('/products/:id', apiController.productDelete);

module.exports = router;

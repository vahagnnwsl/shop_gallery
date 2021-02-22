var express = require('express');
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'temp/', })

const apiController = require('../controllers/api.controller');

router.post('/categories/update-image', upload.single('image'), apiController.updateImages);

router.get('/categories', apiController.categories);
router.delete('/categories/:id', apiController.deleteCategory);
router.post('/categories/:id', apiController.updateCategory);

router.get('/products', apiController.products);
router.post('/products/:id', apiController.productDelete);


router.get('/products/:id', apiController.getProduct);


// router.get('/test', apiController.test);

module.exports = router;

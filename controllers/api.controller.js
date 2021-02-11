var categoryModel = require('../models/category'),
    subCategoryModel = require('../models/subCategory'),
    subSubCategoryModel = require('../models/subSubCategory'),
    productsModel = require('../models/products');

class ApiController {

    async categories(req, res) {

        let q = {};
        let products = {};

        if (req.query.term) {
            q.name = new RegExp(req.query.term, 'i');
            products = await productsModel.find(q)
        }


        let categories = await categoryModel.find(q);
        let subCategories = await subCategoryModel.find(q);
        let subSubCategories = await subSubCategoryModel.find(q);

        const result = [...categories, ...subCategories, ...subSubCategories];

        res.json({categories: result, products: products});
    }

}


module.exports = new ApiController();
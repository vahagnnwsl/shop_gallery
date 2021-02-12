const categoryModel = require('../models/category'),
    subCategoryModel = require('../models/subCategory'),
    subSubCategoryModel = require('../models/subSubCategory'),
    productsModel = require('../models/products');

const LIMIT = 100;

class ApiController {

    async categories(req, res) {

        let q = {};
        if (req.query.term) {
            q.name = new RegExp(req.query.term, 'i');
        }

        let categories = await categoryModel.find(q);
        let subCategories = await subCategoryModel.find(q);
        let subSubCategories = await subSubCategoryModel.find(q);

        const result = [...categories, ...subCategories, ...subSubCategories];
        // const result = [...categories];

        res.json({categories: result});
    }


    async products(req, res) {
        let page = req.query.page || 1;
        let products = {};
        let q = {
            categoryID: { "$ne": null },
            subCategoryID: { "$ne": null },
            subSubCategoryID: { "$ne": null }
        };

        if (req.query.term) {

            q.name = new RegExp(req.query.term, 'i');


        }

        products = await productsModel.paginate(q, {
            offset: (page - 1) * LIMIT,
            limit: LIMIT
        }, function (err, result) {
        });

        res.json({products: products});


    }

    async productDelete(req, res){
        let {id} = req.params;
        await productsModel.deleteOne({_id: id});
        res.json({ status: true, msg: "Album was deleted successfully"});
    }
}


module.exports = new ApiController();
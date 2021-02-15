const categoryModel = require('../models/category'),
    subCategoryModel = require('../models/subCategory'),
    subSubCategoryModel = require('../models/subSubCategory'),
    productsModel = require('../models/products');


const LIMIT = 100;
var fs = require('fs');
const BunnyStorage = require('bunnycdn-storage').default;
const bunnyStorage = new BunnyStorage('2a944ef0-da96-4a87-8201f411dcb2-5fc9-4073', 'fashinbutik/');

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
            categoryID: {"$ne": null},
            subCategoryID: {"$ne": null},
            subSubCategoryID: {"$ne": null}
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

    async productDelete(req, res) {
        let {id} = req.params;
        await productsModel.deleteOne({_id: id});
        res.json({status: true, msg: "Album was deleted successfully"});
    }

    async deleteCategory(req, res) {
        let model = null;

        if (req.body.type === 'category') {
            model = await categoryModel.findById(req.params.id)
        } else if (req.body.type === 'subCategory') {
            model = await subCategoryModel.findById(req.params.id)
        } else {
            model = await subSubCategoryModel.findById(req.params.id)
        }

         console.log(model)
        await model.delete()
        res.json({status: true});

    }

    async updateImages(req, res) {
        console.log(req.body)
        // console.log(req.file)

        let model = null;

        if (req.body.type === 'category') {
            model = await categoryModel.findById(req.body.id)
        } else if (req.body.type === 'subCategory') {
            model = await subCategoryModel.findById(req.body.id)
        } else {
            model = await subSubCategoryModel.findById(req.body.id)
        }

        let image = fs.readFileSync(req.file.path);
        let key = `category/${req.body.type}/${req.file.filename}.${req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]}`
        await bunnyStorage.upload(image, key);


        console.log(req.body.id)
        console.log(req.body.type)
        model.imageUrl = `${process.env.PULL_ZONE_URL}${key}`
        await model.save();

        res.json({status: `${process.env.PULL_ZONE_URL}${key}`});

    }

}


module.exports = new ApiController();
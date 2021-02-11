var categoryModel = require('../models/category'),
    subCategoryModel = require('../models/subCategory'),
    subSubCategoryModel = require('../models/subSubCategory');

class ApiController {

    async categories(req, res) {

        const regExp = new RegExp(req.query.term, 'i')

        let categories = await categoryModel.find({name :   regExp });
        let subCategories = await subCategoryModel.find({name :   regExp });
        let subSubCategories = await subSubCategoryModel.find({name :   regExp });

        const result = [...categories,...subCategories,...subSubCategories];

        res.json({ categories: result});
    }

}


module.exports = new ApiController();
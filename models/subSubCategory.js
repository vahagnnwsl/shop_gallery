var mongoose = require('mongoose');

var subSubCategory = mongoose.Schema({
        categoryID: {
            type: String,
            required: true
        },
        subCategoryID: {
            type: String,
            required: true
        },
        subSubCategoryID: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: false
        }
    }
)

subSubCategory.pre("save", async function (next) {
    this.url = `/category/${this.categoryID}/subCategory/${this.subCategoryID}/subSubCategory/${this.subSubCategoryID}`
    next()
});

module.exports = mongoose.model('subSubCategory', subSubCategory);
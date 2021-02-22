var mongoose = require('mongoose');

var subCategory = mongoose.Schema({
    categoryID: {
        type: String,
        required: true
    },
    subCategoryID: {
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

subCategory.pre("save", async function (next) {
    this.url = `/category/${this.categoryID}/subCategory/${this.subCategoryID}`;
    next()
});

module.exports = mongoose.model('subCategory', subCategory);
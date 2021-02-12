var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var products = mongoose.Schema({
    categoryID: {
        type: String,
        required: true
    },
    subCategoryID: {
        type: String,
        required: true
    },
    subSubCategoryID: {
        type:String,
        required: true
    },
    tag:{
        type:String,
        required: false
    },
    cover:{
        type:String,
        required:false
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
}
)
products.plugin(mongoosePaginate);

module.exports = mongoose.model('products', products);
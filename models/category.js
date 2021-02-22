var mongoose = require('mongoose');

var category = mongoose.Schema({
        categoryID: {
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
        sub: {
            type: Array,
            required: false
        },
        show: {
            type: Boolean,
            required: false,
            default: true
        },
        url: {
            type: String,
            required: false
        }
    }
)


category.pre("save", async function (next) {
    this.url = `/category/${this.categoryID}`;
    next();
});

module.exports = mongoose.model('category', category);
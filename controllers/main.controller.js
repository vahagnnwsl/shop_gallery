var request = require('request');
var invoiceModel = require('../models/ivoices');
var ejs = require('ejs')
var fs = require('fs');
var AWS = require('aws-sdk');
var bucket = new AWS.S3();
var categoryModel = require('../models/category');
var subCategoryModel = require('../models/subCategory')
var subSubCategoryModel = require('../models/subSubCategory')
var goodsModel = require('../models/goods');
var productsModel = require('../models/products');
const { response } = require('express');
const BunnyStorage = require('bunnycdn-storage').default;
const bunnyStorage = new BunnyStorage('2a944ef0-da96-4a87-8201f411dcb2-5fc9-4073', 'fashinbutik/');

class mainController {
    async seeds(req, res) {
        let goods = await goodsModel.find({})

        for (let i = 0; i < goods.length; i++) {
            let good = goods[i];
            let { images, name, description } = good
            let item = {
                images,
                name,
                description,
                categoryID: 'km9UpKcZ',
                subCategoryID: 'Y4s2AX6T'
            }
            await productsModel.create(item);
        }
        res.send('Created');
    }

    index(req, res) {
        if(req.isAuthenticated()){
            res.render('index');

        }else{
            res.render('index_user');
        }
    }
    subCategory(req, res) {
        if(req.isAuthenticated()){
            res.render('pages/subCategory');
        }else{
            res.render('pages/subCategory_user')
        }
    }
    subSubCategory(req, res){
        if(req.isAuthenticated()){
            res.render('pages/subsubCategory');
        }else{
            res.render('pages/subsubCategory_user');
        }
    }
    productPage(req, res) {
        if(req.isAuthenticated()){
            res.render('pages/productView');
        }else{
            res.render('pages/productView_user');
        }
    }
    searchAlbum(req, res){
        res.render('pages/search');
    }
    // async getProducts(req, res) {
    //     let { categoryID, subCategoryID, subSubCategoryID, page, name } = req.body;
    //     page = parseInt(page)
    //     if (page == 1) {
    //         let category = await categoryModel.findOne({ categoryID })
    //         let subCategory = await subCategoryModel.findOne({ subCategoryID });
    //         let subSubCategory = await subSubCategoryModel.findOne({ subSubCategoryID});
    //         let breadcrumb = {
    //             category,
    //             subCategory,
    //             subSubCategory
    //         }
    //         let productsCount = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).countDocuments()
    //         let products = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).limit(24)
    //         res.json({ status: true, data: products, productsCount, breadcrumb });
    //     } else {
    //         let products = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).skip((page - 1) * 24).limit(24)
    //         res.json({ status: true, data: products });
    //     }
    // }

    async getProducts(req, res) {
        console.log(44444)
        let { categoryID, subCategoryID, subSubCategoryID, page, name } = req.body;
        page = parseInt(page)
        let total = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID, $or: [
                { name: new RegExp(name, 'i' ) },
                { description: new RegExp(name, 'i') },
            ] });
        let products = [];
        // let filtered = total.filter(item => item.name.toLowerCase().includes(name) == true);
        if (page == 1) {
            let category = await categoryModel.findOne({ categoryID })
            let subCategory = await subCategoryModel.findOne({ subCategoryID });
            let subSubCategory = await subSubCategoryModel.findOne({ subSubCategoryID});
            let breadcrumb = {
                category,
                subCategory,
                subSubCategory
            }
            let productsCount = 0;
            
            // if(!name){
            //     productsCount = total.length;
            //     products = total.slice(0, 100);
            // }else{
            //
            //     productsCount = total.length;
            //     products = filtered.slice(0, 100);
            // }

            productsCount = total.length;
            products = total.slice(0, 100);

            //let productsCount = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).countDocuments()
            //let products = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).limit(24)
            res.json({ status: true, data: products, productsCount, breadcrumb });
        } else {
            //let products = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID }).skip((page - 1) * 24).limit(24)
            if(!name){
                products = total.slice((page-1)*100, page*100);
            }else{
                products = filtered.slice((page-1)*100, page*100);
            }
            res.json({ status: true, data: products });
        }
    }

    // async getAllProducts(req, res){
    //     let { categoryID, subCategoryID, subSubCategoryID} = req.body;
    //     let category = await categoryModel.findOne({ categoryID });
    //     let subCategory = await subCategoryModel.findOne({ subCategoryID });
    //     let subSubCategory = await subSubCategoryModel.findOne({ subSubCategoryID });
    //     let breadcrumb = {
    //         category,
    //         subCategory,
    //         subSubCategory
    //     };
    //     let products = await productsModel.find({ categoryID, subCategoryID, subSubCategoryID });
    //     res.json({ status: true, data: products, breadcrumb });
    // }

    async editProduct(req, res) {
        let { name, description, _id, tag, categoryID, subCategoryID, subSubCategoryID } = req.body;
        productsModel.findOneAndUpdate({ _id }, { name, description, tag, categoryID, subCategoryID, subSubCategoryID }, (err, response) => {
            if (err) return res.json({ status: false, msg: "Unknown Error" });
            res.json({status:true, msg:"Successfully saved."});
        })
        
    }
    async editProductPath(req, res){
        let { categoryID, subCategoryID, subSubCategoryID} =  req.body;
        let selectedAlbums = JSON.parse(req.body.selectedAlbums);
        selectedAlbums.forEach(element => {
           productsModel.findOneAndUpdate({_id: element}, {categoryID: categoryID, subCategoryID: subCategoryID, subSubCategoryID: subSubCategoryID}, (err, response)=>{
               if(err) return res.json({status:false, msg:"Unknown Error"});
           }) 
        });
        res.json({status: true, msg:"Successfully changed."});

    }
    async searchByTag(req, res){
        let {tag} = req.body;
        let productsCount = await productsModel.find({tag}).countDocuments();
        let products = await productsModel.find({tag});
        res.json({status:true, data:products, productsCount});
    }
    async setCover(req, res){
        let {_id, cover} = req.body;
        productsModel.findOneAndUpdate({_id}, {cover}, (err, response)=>{
            if(err) return res.json({status:false, msg:"Unknown error"});
            res.json({status:true, msg:"Cover was set successfully"})
        })
    }
    async download(req, res) {
        let { id } = req.params
        let file = `${process.cwd()}/invoices/${id}.pdf`;
        res.download(file)
    }
    async deleteCategory(req, res) {
        let { id } = req.params;
        await categoryModel.deleteOne({ categoryID: id });
        await subCategoryModel.deleteMany({ categoryID: id});
        await subSubCategoryModel.deleteMany({ categoryID: id});
        await productsModel.deleteMany({categoryID: id});
        res.json({ status: true, msg: "Category was deleted" });
    }
    async deleteAlbum(req, res){
        let {id} = req.params;
        await productsModel.deleteOne({_id: id});
        res.json({ status: true, msg: "Album was deleted successfully"});
    }
    async setProductName(req, res){
        let {_id, name} = req.body;
        let filter = {_id: _id};
        let update = {name : name};
        await productsModel.findOneAndUpdate(filter, update, (err, response)=>{
            if(err) return res.json({status: false, msg:"Unknown error"});
            res.json({status:true, msg:"Album name saved successfully : "+name});
        })
    }
    async createCategory(req, res) {
        if(!req.file){
            let data_1 = {
                categoryID: generateRandomString(8),
                name: req.body.categoryName,
                imageUrl:`${process.env.PULL_ZONE_URL}category/760dfa0cd3713d985393ea36da0ae3e1.jpg`
            }
            await categoryModel.create(data_1);
            return res.json({status:true, msg:"Category was created without image"});
        }
        let image = fs.readFileSync(req.file.path)
        let key = `category/${req.file.filename}.${req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]}`
        let response = await bunnyStorage.upload(image, key);
        let { data } = response
        if (data.Message == 'File uploaded.') {
            let categoryID = generateRandomString(8);
            let data = {
                categoryID,
                name: req.body.categoryName,
                imageUrl: `${process.env.PULL_ZONE_URL}${key}`
            }
            await categoryModel.create(data)
            fs.unlinkSync(`${req.file.path}`)
            res.json({ status: true, msg: "Category was Created", data });;
        } else {
            res.json({ status: false, msg: "Some error was caused." });
        }
    }
    async createSubCategory(req, res) {
        if(!req.file){
            let data_1 = {
                categoryID: req.body.categoryID,
                subCategoryID: generateRandomString(8),
                name: req.body.subCategoryName,
                imageUrl:`${process.env.PULL_ZONE_URL}category/760dfa0cd3713d985393ea36da0ae3e1.jpg`
            }
            await subCategoryModel.create(data_1);
            return res.json({status:true, msg:"Subcategory was created without image"});
        }
        let image = fs.readFileSync(req.file.path);
        let key = `category/${req.file.filename}.${req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]}`
        let response = await bunnyStorage.upload(image, key);
        let { data } = response;
        console.log("mainController -> createSubCategory -> data", data)
        if (data.Message == 'File uploaded.') {
            let subCategoryID = generateRandomString(8);
            let subcategory = {
                categoryID: req.body.categoryID,
                subCategoryID,
                name: req.body.subCategoryName,
                imageUrl: `${process.env.PULL_ZONE_URL}${key}`
            }
            await subCategoryModel.create(subcategory)
            fs.unlinkSync(`${req.file.path}`)
            res.json({ status: true, msg: "Subcategory was Created" });;
        } else {
            res.json({ status: false, msg: "Some error was caused." });
        }
    }
    
    async createSubSubcategory(req, res) {
        if(!req.file){
            let data_1 = {
                categoryID: req.body.categoryID,
                subCategoryID: req.body.subCategoryID,
                subSubCategoryID: generateRandomString(8),
                name: req.body.subSubCategoryName,
                imageUrl:`${process.env.PULL_ZONE_URL}category/760dfa0cd3713d985393ea36da0ae3e1.jpg`
            }
            await subSubCategoryModel.create(data_1);
            return res.json({status:true, msg:"SubSubCategory was created without image"});
        }
        let image = fs.readFileSync(req.file.path);
        let key = `category/subCategory/${req.file.filename}.${req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]}`
        let response = await bunnyStorage.upload(image, key);
        let { data } = response;
        console.log("mainController -> createSubSubCategory -> data", data)
        if (data.Message == 'File uploaded.') {
            let subSubCategoryID = generateRandomString(8);
            let subSubCategory = {
                categoryID: req.body.categoryID,
                subCategoryID: req.body.subCategoryID,
                subSubCategoryID,
                name: req.body.subSubCategoryName,
                imageUrl: `${process.env.PULL_ZONE_URL}${key}`
            }
            await subSubCategoryModel.create(subSubCategory)
            fs.unlinkSync(`${req.file.path}`)
            res.json({ status: true, msg: "SubSubCategory was Created" });;
        } else {
            res.json({ status: false, msg: "Some error was caused." });
        }
    }

    async deleteSubCategory(req, res) {
        let { categoryID, id } = req.params;
        await subCategoryModel.findOneAndDelete({ subCategoryID:id });
        await subSubCategoryModel.deleteMany({ subCategoryID: id});
        await productsModel.deleteMany({subCategoryID: id});
        res.json({ status: true, msg: "SubCategory was deleted" });
    }

    async deleteSubSubCategory(req, res) {
        let { categoryID, id } = req.params;
        await subSubCategoryModel.findOneAndDelete({ subSubCategoryID:id });
        await productsModel.deleteMany({subSubCategoryID: id});
        res.json({ status: true, msg: "subSubCategory was deleted" });
    }

    async createProductDB(req, res) {
        let data = req.body;
        console.log("mainController -> createProductDB -> data", data)
        await productsModel.create(data);
        res.json({ status: true });
    }
    async getCategory(req, res) {
        let data = await categoryModel.find({});
        res.json({ status: true, data });
    }
    async getCategories(req, res) {
        let category = await categoryModel.find({});
        let subCategory = await subCategoryModel.find({ categoryID: category[0].categoryID });
        let subSubCategory = await subSubCategoryModel.find({ categoryID:category[0].categoryID, subCategoryID:subCategory[0].subCategoryID});
        let data = {
            category,
            subCategory,
            subSubCategory
        }
        res.json({ status: true, data });
    }
    async getSubCategory(req, res) {
        let { categoryID } = req.body
        let data = await subCategoryModel.find({ categoryID: categoryID });
        let categoryOne = await categoryModel.findOne({categoryID: categoryID});
        let categoryName = categoryOne.name;
        res.json({ status: true, data, categoryName });
    }
    async getSubSubCategory(req, res){
        let { categoryID, subCategoryID} = req.body;
        let categoryOne = await categoryModel.findOne({categoryID: categoryID});
        let categoryName = categoryOne.name;
        let subCategoryOne = await subCategoryModel.findOne({categoryID: categoryID, subCategoryID: subCategoryID});
        let subCategoryName = subCategoryOne.name;
        let data =await subSubCategoryModel.find({categoryID: categoryID, subCategoryID: subCategoryID });
        res.json({ status: true, data, categoryName, subCategoryName});
    }

    async createInvoice(req, res) {
        let user = req.user;
        delete user.password
        if (req.method == 'GET') {
            res.render('pages/invoice', { title: 'Create Invoice', user: user });
        } else if (req.method == 'POST') {
            let { invoiceList } = req.body;
            invoiceList = JSON.parse(invoiceList);
            let { data, others } = invoiceList;
            let totalYuan = 0;
            for (let i = 0; i < data.length; i++) {
                totalYuan += parseFloat(data[i].price) * data[i].qty + parseFloat(data[i].shippingCost);
            }
            let totalCommition = (others.commision * totalYuan / 100).toFixed(2);
            let totalNaira = (totalYuan * others.exchangeRate).toFixed(2);
            others.customerInfo.address = others.shipAddress
            let tdata = {
                user: others.customerInfo,
                data,
                totalYuan,
                totalCommition,
                totalNaira,
                currentTime: new Date()
            }
            // res.json({ status: true });
            let nowDate = Date.now();
            let options = { format: 'A4' };
            ejs.renderFile(`${process.cwd()}/views/pages/invoice-template.ejs`, { data: tdata }, function (err, data) {
                pdf.create(data, options).toFile(`${process.cwd()}/invoices/${nowDate}.pdf`, (err, data) => {
                    if (err) {
                        res.json({ status: false });
                    } else {
                        invoiceModel.create({
                            userID: user.userID,
                            name: `${others.customerInfo.firstName} ${others.customerInfo.lastName}`,
                            time: nowDate
                        }, (err, response) => {
                            if (err) {
                                res.json({ status: false });
                            }
                            res.json({ status: true });;
                        })
                    }
                })
            })
        }
    }

    async viewProductDetail(req, res) {
        let { id } = req.body;
        let { SECRET_KEY, API_KEY } = process.env;
        let url = `https://api.onebound.cn/1688/api_call.php?key=${API_KEY}&secret=${SECRET_KEY}&api_name=item_get&num_iid=${id}&lang=en`
        let response = await sendRequest(url)
        response = JSON.parse(response);
        if (response.item) {
            let { detail_url, pic_url, price, express_fee, props } = response.item;
            let productDetail = {
                detail_url, pic_url, price, express_fee
            }
            if (props && props.length > 0) {
                for (let i = 0; i < props.length; i++) {
                    let prop = props[i];
                    if (prop.name == 'color') productDetail.color = prop.value.split(',');
                    if (prop.name == 'size') productDetail.size = prop.value.split(',');
                }
            }
            res.json({ status: true, productDetail });
        } else {
            res.json({ status: false, msg: response.error });
        }
    }
}

function generateRandomString(length) {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = length;
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        let options = {
            url: url,
            method: "GET",
            headers: {}
        };
        request(options, (err, res, body) => {
            if (err) console.log(err);
            resolve(body);
        });
    });
}


module.exports = mainController;
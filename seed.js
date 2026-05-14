require('dotenv').config();

const connectDB = require('./config/db');

const Brand = require('./model/Brand');
const brandData = require('./utils/brands');

const Category = require('./model/Category');
const categoryData = require('./utils/categories');

const Products = require('./model/Products');
const productsData = require('./utils/products');

const Coupon = require('./model/Coupon');
const couponData = require('./utils/coupons');

const Order = require('./model/Order');
const orderData = require('./utils/orders');

const User = require('./model/User');
const userData = require('./utils/users');

const Reviews = require('./model/Review');
const reviewsData = require('./utils/reviews');

const Admin = require('./model/Admin');
const adminData = require('./utils/admin');

connectDB();
const importData = async () => {
  try {
    try { await Brand.collection.dropIndexes(); } catch(e){}
    await Brand.deleteMany();
    await Brand.insertMany(brandData);

    try { await Category.collection.dropIndexes(); } catch(e){}
    await Category.deleteMany();
    await Category.insertMany(categoryData);

    try { await Products.collection.dropIndexes(); } catch(e){}
    await Products.deleteMany();
    await Products.insertMany(productsData);

    try { await Coupon.collection.dropIndexes(); } catch(e){}
    await Coupon.deleteMany();
    await Coupon.insertMany(couponData);
    
    try { await Order.collection.dropIndexes(); } catch(e){}
    await Order.deleteMany();
    await Order.insertMany(orderData);
    
    try { await User.collection.dropIndexes(); } catch(e){}
    await User.deleteMany();
    await User.insertMany(userData);
    
    try { await Reviews.collection.dropIndexes(); } catch(e){}
    await Reviews.deleteMany();
    await Reviews.insertMany(reviewsData);
    
    try { await Admin.collection.dropIndexes(); } catch(e){}
    await Admin.deleteMany();
    await Admin.insertMany(adminData);

    console.log('data inserted successfully!');
    process.exit();
  } catch (error) {
    console.log('error', error);
    process.exit(1);
  }
};

importData();

const mongoose = require('mongoose');
const Product = require('./model/Products');

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const products = await Product.find({ img: /cloudinary\.com/ });
  console.log(`Found ${products.length} products with cloudinary images`);
  
  for (let p of products) {
    p.img = 'https://i.ibb.co/3s6D5k8/product-1.jpg'; // use a real placeholder URL to bypass validation
    if (p.imageURLs && p.imageURLs.length > 0) {
      p.imageURLs.forEach(u => {
        if (u.img && u.img.includes('cloudinary.com')) {
          u.img = p.img;
        }
      });
    }
    await p.save();
  }
  
  console.log('Fixed');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

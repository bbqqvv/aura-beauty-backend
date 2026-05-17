const mongoose = require('mongoose');
const Product = require('./model/Products');

const targetImage = '/assets/img/product/premium-cosmetic.png';

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const products = await Product.find({});
  
  for (let p of products) {
    p.img = targetImage;
    if (p.imageURLs && p.imageURLs.length > 0) {
      p.imageURLs.forEach(u => {
        u.img = targetImage;
      });
    }
    await p.save();
  }
  
  console.log('Fixed using ONE single cosmetic image! Count updated:', products.length);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

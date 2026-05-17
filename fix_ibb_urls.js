const mongoose = require('mongoose');
const Product = require('./model/Products');

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const products = await Product.find({ img: /i\.ibb\.co/ });
  
  for (let p of products) {
    p.img = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop';
    if (p.imageURLs && p.imageURLs.length > 0) {
      p.imageURLs.forEach(u => {
        if (u.img && u.img.includes('i.ibb.co')) {
          u.img = p.img;
        }
      });
    }
    await p.save();
  }
  
  console.log('Fixed ibb to unsplash');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

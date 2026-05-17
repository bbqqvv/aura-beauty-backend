const mongoose = require('mongoose');
const Product = require('./model/Products');

const localImages = [];
for(let i = 1; i <= 17; i++) {
  localImages.push(`/assets/img/product/product-${i}.jpg`);
}

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const products = await Product.find({ 
    $or: [
      { img: /i\.ibb\.co/ },
      { img: /cloudinary\.com/ },
      { img: /images\.unsplash\.com/ }
    ]
  });
  
  let i = 0;
  for (let p of products) {
    const selectedImage = localImages[i % localImages.length];
    p.img = selectedImage;
    if (p.imageURLs && p.imageURLs.length > 0) {
      p.imageURLs.forEach(u => {
        if (u.img && (u.img.includes('i.ibb.co') || u.img.includes('cloudinary.com') || u.img.includes('unsplash.com'))) {
          u.img = selectedImage;
        }
      });
    }
    await p.save();
    i++;
  }
  
  console.log('Fixed using strictly LOCAL images! Count updated:', products.length);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

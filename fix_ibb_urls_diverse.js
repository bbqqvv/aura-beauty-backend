const mongoose = require('mongoose');
const Product = require('./model/Products');

const diverseImages = [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580870058816-160759089025?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615397323281-22441cc9aebc?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477eb31f859?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512496015851-a1cbfb40a3f6?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590156546946-cb56d8170c8a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop'
];

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const products = await Product.find({ 
    $or: [
      { img: /i\.ibb\.co/ },
      { img: /cloudinary\.com/ }
    ]
  });
  
  let i = 0;
  for (let p of products) {
    const selectedImage = diverseImages[i % diverseImages.length];
    p.img = selectedImage;
    if (p.imageURLs && p.imageURLs.length > 0) {
      p.imageURLs.forEach(u => {
        if (u.img && (u.img.includes('i.ibb.co') || u.img.includes('cloudinary.com'))) {
          u.img = selectedImage;
        }
      });
    }
    await p.save();
    i++;
  }
  
  console.log('Fixed ibb with diverse images!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

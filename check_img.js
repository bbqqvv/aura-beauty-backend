const mongoose = require('mongoose');
const Product = require('./model/Products');

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const p = await Product.findOne({ title: /Face Wash/i });
  console.log('img:', p.img);
  process.exit(0);
});

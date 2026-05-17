const mongoose = require('mongoose');
const Category = require('./model/Category');
const Product = require('./model/Products');

const categoryMap = [
  { old: /headphones/i, newName: "Premium Skincare" },
  { old: /mobile tablets/i, newName: "Makeup" },
  { old: /cpu heat pipes/i, newName: "Haircare" },
  { old: /smart watch/i, newName: "Fragrance" },
  { old: /bluetooth/i, newName: "Bath & Body" },
  { old: /clothing/i, newName: "Tools & Brushes" },
  { old: /bags/i, newName: "Men's Grooming" },
  { old: /shoes/i, newName: "Gifts & Sets" }
];

const targetImage = '/assets/img/product/premium-cosmetic.png';

mongoose.connect('mongodb://127.0.0.1:27017/shofy').then(async () => {
  const categories = await Category.find({});
  
  for (let c of categories) {
    const match = categoryMap.find(cm => cm.old.test(c.parent));
    if (match) {
      const oldName = c.parent;
      c.parent = match.newName;
      c.img = targetImage;
      await c.save();
      
      // Update all products associated with this category
      const products = await Product.find({ "category.id": c._id });
      for (let p of products) {
        p.category.name = match.newName;
        if (p.parent === oldName) {
          p.parent = match.newName;
        }
        await p.save();
      }
    } else {
      c.img = targetImage;
      await c.save();
    }
  }
  
  console.log('Fixed categories to cosmetics only!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

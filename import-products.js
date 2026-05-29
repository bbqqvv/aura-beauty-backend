require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./model/Products');
const Category = require('./model/Category');
const Brand = require('./model/Brand');

// Simple helper to slugify product titles if slug is missing
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function run() {
  const jsonPath = path.join(__dirname, 'products_to_import.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`\x1b[31mError: File not found at ${jsonPath}\x1b[0m`);
    console.log('Please create a products_to_import.json file in this directory.');
    process.exit(1);
  }

  let productsToImport;
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    productsToImport = JSON.parse(rawData);
  } catch (error) {
    console.error('\x1b[31mError parsing products_to_import.json:\x1b[0m', error.message);
    process.exit(1);
  }

  if (!Array.isArray(productsToImport)) {
    console.error('\x1b[31mError: products_to_import.json must be a JSON array of products.\x1b[0m');
    process.exit(1);
  }

  console.log(`Found ${productsToImport.length} products to import. Connecting to MongoDB...`);
  await connectDB();

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < productsToImport.length; i++) {
    const item = productsToImport[i];
    console.log(`\n[${i + 1}/${productsToImport.length}] Processing product: "${item.title || 'Untitled'}"...`);

    // 1. Validation
    if (!item.title || !item.img || item.price === undefined || item.quantity === undefined || !item.parent || !item.children || !item.brand) {
      console.error(`\x1b[31m  -> Skip: Missing required fields (title, img, price, quantity, parent, children, brand)\x1b[0m`);
      failureCount++;
      continue;
    }

    try {
      // 2. Find Category
      const categoryDoc = await Category.findOne({ parent: { $regex: new RegExp(`^${item.parent.trim()}$`, 'i') } });
      if (!categoryDoc) {
        console.error(`\x1b[31m  -> Skip: Category parent "${item.parent}" not found in database.\x1b[0m`);
        failureCount++;
        continue;
      }

      // Check if subcategory exists in children array of the category
      const normalizedChild = item.children.trim();
      const hasChild = categoryDoc.children.some(c => c.toLowerCase() === normalizedChild.toLowerCase());
      if (!hasChild) {
        console.warn(`\x1b[33m  -> Warning: Subcategory "${item.children}" not found in children list of "${item.parent}". Adding it now...\x1b[0m`);
        await Category.updateOne(
          { _id: categoryDoc._id },
          { $addToSet: { children: normalizedChild } }
        );
        categoryDoc.children.push(normalizedChild);
      }

      // 3. Find Brand
      const brandDoc = await Brand.findOne({ name: { $regex: new RegExp(`^${item.brand.trim()}$`, 'i') } });
      if (!brandDoc) {
        console.error(`\x1b[31m  -> Skip: Brand "${item.brand}" not found in database.\x1b[0m`);
        failureCount++;
        continue;
      }

      // 4. Check for duplicates (optional, based on title/slug)
      const slugVal = item.slug || slugify(item.title);
      const existingProduct = await Product.findOne({ slug: slugVal });
      if (existingProduct) {
        console.warn(`\x1b[33m  -> Skip: Product with slug "${slugVal}" already exists in database.\x1b[0m`);
        failureCount++;
        continue;
      }

      // 5. Prepare product data
      const productPayload = {
        title: item.title,
        slug: slugVal,
        sku: item.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        img: item.img,
        unit: item.unit || 'pc',
        parent: categoryDoc.parent,
        children: normalizedChild,
        price: Number(item.price),
        discount: Number(item.discount || 0),
        quantity: Number(item.quantity),
        status: item.status || 'in-stock',
        productType: item.productType || 'beauty',
        description: item.description || '',
        brand: {
          name: brandDoc.name,
          id: brandDoc._id
        },
        category: {
          name: categoryDoc.parent,
          id: categoryDoc._id
        },
        imageURLs: item.imageURLs || [],
        tags: item.tags || [categoryDoc.parent, normalizedChild, brandDoc.name],
        sizes: item.sizes || [],
        additionalInformation: item.additionalInformation || [],
        featured: !!item.featured
      };

      // 6. Save Product to Database
      const newProduct = await Product.create(productPayload);

      // 7. Update Brand with new product ID
      await Brand.updateOne(
        { _id: brandDoc._id },
        { $push: { products: newProduct._id } }
      );

      // 8. Update Category with new product ID
      await Category.updateOne(
        { _id: categoryDoc._id },
        { $push: { products: newProduct._id } }
      );

      console.log(`\x1b[32m  -> Success: Created product successfully! ID: ${newProduct._id}\x1b[0m`);
      successCount++;

    } catch (dbErr) {
      console.error(`\x1b[31m  -> Error saving to database:\x1b[0m`, dbErr.message);
      failureCount++;
    }
  }

  console.log('\n======================================');
  console.log(`Import finished!`);
  console.log(`\x1b[32mSuccessfully imported: ${successCount}\x1b[0m`);
  console.log(`\x1b[31mFailed/Skipped: ${failureCount}\x1b[0m`);
  console.log('======================================');
  process.exit(0);
}

run();

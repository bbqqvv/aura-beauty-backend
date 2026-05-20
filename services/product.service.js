const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");

// create product service
exports.createProductService = async (data) => {
  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;
  //update Brand
  await Brand.updateOne(
    { _id: brand.id },
    { $push: { products: productId } }
  );
  //Category Brand
  await Category.updateOne(
    { _id: category.id },
    { $push: { products: productId } }
  );
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await Product.deleteMany();
  const products = await Product.insertMany(data);
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async (query) => {
  const { page, limit, searchTerm } = query || {};
  const pages = Number(page) || 1;
  const limits = Number(limit) || 1000;
  const skip = (pages - 1) * limits;

  let queryObject = {};
  if (searchTerm) {
    queryObject = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } }
      ]
    };
  }

  const products = await Product.find(queryObject)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limits)
    .populate("reviews");
  
  const total = await Product.countDocuments(queryObject);

  return { products, total, page: pages, limit: limits };
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  if (query.new === "true") {
    products = await Product.find({ productType: type })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("reviews");
  } else if (query.featured === "true") {
    products = await Product.find({
      productType: type,
      featured: true,
    }).populate("reviews");
  } else if (query.topSellers === "true") {
    products = await Product.find({ productType: type })
      .sort({ sellCount: -1 })
      .limit(8)
      .populate("reviews");
  } else {
    products = await Product.find({ productType: type }).populate("reviews");
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate("reviews");
  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({ productType: type })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate("reviews");
  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate("reviews");

  const topRatedProducts = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product.toObject(),
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};

// get product data
exports.getProductService = async (id) => {
  const product = await Product.findById(id).populate({
    path: "reviews",
    populate: { path: "userId", select: "name email imageURL" },
  });
  return product;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.name": currentProduct.category.name,
    _id: { $ne: productId }, // Exclude the current product ID
  });
  return relatedProducts;
};

// update a product
exports.updateProductService = async (id, currProduct) => {
  // console.log('currProduct',currProduct)
  const product = await Product.findById(id);
  if (product) {
    if (currProduct.title) product.title = currProduct.title;
    if (currProduct.brand) {
      product.brand.name = currProduct.brand.name;
      product.brand.id = currProduct.brand.id;
    }
    if (currProduct.category) {
      product.category.name = currProduct.category.name;
      product.category.id = currProduct.category.id;
    }
    if (currProduct.sku !== undefined) product.sku = currProduct.sku;
    if (currProduct.img) product.img = currProduct.img;
    if (currProduct.slug !== undefined) product.slug = currProduct.slug;
    if (currProduct.unit) product.unit = currProduct.unit;
    if (currProduct.imageURLs) product.imageURLs = currProduct.imageURLs;
    if (currProduct.tags) product.tags = currProduct.tags;
    if (currProduct.parent) product.parent = currProduct.parent;
    if (currProduct.children) product.children = currProduct.children;
    if (currProduct.price !== undefined) product.price = currProduct.price;
    if (currProduct.discount !== undefined) product.discount = currProduct.discount;
    if (currProduct.quantity !== undefined) product.quantity = currProduct.quantity;
    if (currProduct.status) product.status = currProduct.status;
    if (currProduct.productType) product.productType = currProduct.productType;
    if (currProduct.description) product.description = currProduct.description;
    if (currProduct.additionalInformation) product.additionalInformation = currProduct.additionalInformation;
    
    if (currProduct.offerDate) {
      if (!product.offerDate) product.offerDate = {};
      product.offerDate.startDate = currProduct.offerDate.startDate;
      product.offerDate.endDate = currProduct.offerDate.endDate;
    }

    await product.save();
  }

  return product;
};



// get Reviews Products
exports.getReviewsProducts = async () => {
  const result = await Product.find({
    reviews: { $exists: true, $ne: [] },
  })
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });

  const products = result.filter(p => p.reviews.length > 0)

  return products;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({ createdAt: -1 })
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id)
  return result;
};
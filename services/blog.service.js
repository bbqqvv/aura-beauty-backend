const ApiError = require('../errors/api-error');
const Blog = require('../model/Blog');

// create blog service
exports.createBlogService = async (data) => {
  const blog = await Blog.create(data);
  return blog;
}

// get all blog service
exports.getAllBlogServices = async () => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  return blogs;
}

// update blog
exports.updateBlogService = async (id, payload) => {
  const isExist = await Blog.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(404, 'Blog not found !')
  }

  const result = await Blog.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

// delete blog service
exports.deleteBlogService = async (id) => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
}

// get single blog
exports.getSingleBlogService = async (id) => {
  const result = await Blog.findById(id);
  return result;
}

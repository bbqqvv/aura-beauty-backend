const Order = require('../model/Order');
const User = require('../model/User');
const Products = require('../model/Products');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Total Revenue (sum of totalAmount)
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // 3. Active Customers
    const activeCustomers = await User.countDocuments();

    // 4. Products Sold (sum of items in all orders)
    let productsSold = 0;
    orders.forEach(order => {
      if (order.cart && order.cart.length > 0) {
        order.cart.forEach(item => {
          productsSold += item.orderQuantity || 1;
        });
      }
    });

    // 5. Recent Orders (last 4)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(4).lean();

    // 6. Revenue Overview (mock for now or group by day)
    const revenueData = [
      { name: 'Mon', revenue: 4000 },
      { name: 'Tue', revenue: 3000 },
      { name: 'Wed', revenue: 2000 },
      { name: 'Thu', revenue: 2780 },
      { name: 'Fri', revenue: 1890 },
      { name: 'Sat', revenue: 2390 },
      { name: 'Sun', revenue: Math.floor(totalRevenue / 10) }, // Just something dynamic
    ];

    // 7. Sales by Category (mock for now)
    const categoryData = [
      { name: 'Skincare', value: 400 },
      { name: 'Makeup', value: 300 },
      { name: 'Haircare', value: 300 },
      { name: 'Fragrance', value: Math.floor(productsSold / 2) }, // Dynamic mock
    ];

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeCustomers,
        productsSold,
        recentOrders,
        revenueData,
        categoryData
      }
    });
  } catch (error) {
    next(error);
  }
};

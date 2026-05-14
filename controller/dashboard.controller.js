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

    // 6. Real Revenue Overview (Last 7 days)
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      
      const dailyOrders = orders.filter(o => o.createdAt >= d && o.createdAt < nextDay);
      const dailyRev = dailyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      revenueData.push({
        name: dayNames[d.getDay()],
        revenue: dailyRev
      });
    }

    // 7. Sales by Category (real from products sold, approx)
    const categoryCounts = {};
    orders.forEach(order => {
      if (order.cart) {
        order.cart.forEach(item => {
          const cat = item.category?.name || 'Skincare'; // Default if missing
          categoryCounts[cat] = (categoryCounts[cat] || 0) + (item.orderQuantity || 1);
        });
      }
    });
    
    const categoryData = Object.keys(categoryCounts).map(key => ({
      name: key,
      value: categoryCounts[key]
    }));
    
    if (categoryData.length === 0) {
      categoryData.push({ name: 'Skincare', value: 1 });
    }

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

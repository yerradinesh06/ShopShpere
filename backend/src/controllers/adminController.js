const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const products = await Product.find({});
    const orders = await Order.find({});

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Identify low stock items
    const lowStockAlerts = [];
    products.forEach((p) => {
      if (p.countInStock <= 5) {
        lowStockAlerts.push({
          _id: p._id,
          name: p.name,
          countInStock: p.countInStock,
          image: p.image,
        });
      }
    });

    // Calculate sales breakdown by category
    const categorySales = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const matchedProduct = products.find(
          (p) => p._id.toString() === item.product.toString()
        );
        const category = matchedProduct ? matchedProduct.category : 'Electronics';

        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += item.price * item.qty;
      });
    });

    const categoryBreakdown = Object.keys(categorySales).map((cat) => ({
      category: cat,
      revenue: parseFloat(categorySales[cat].toFixed(2)),
    }));

    // Calculate sales trend over time
    const salesTrend = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      // Format: Year-Month
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!salesTrend[yearMonth]) {
        salesTrend[yearMonth] = { revenue: 0, orders: 0 };
      }
      salesTrend[yearMonth].revenue += order.totalPrice;
      salesTrend[yearMonth].orders += 1;
    });

    const monthlySales = Object.keys(salesTrend)
      .map((ym) => ({
        month: ym,
        revenue: parseFloat(salesTrend[ym].revenue.toFixed(2)),
        orders: salesTrend[ym].orders,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate top selling items
    const productQuantities = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const prodId = item.product.toString();
        if (!productQuantities[prodId]) {
          productQuantities[prodId] = { name: item.name, qty: 0, revenue: 0 };
        }
        productQuantities[prodId].qty += item.qty;
        productQuantities[prodId].revenue += item.price * item.qty;
      });
    });

    const topSellingProducts = Object.keys(productQuantities)
      .map((id) => ({
        _id: id,
        name: productQuantities[id].name,
        qty: productQuantities[id].qty,
        revenue: parseFloat(productQuantities[id].revenue.toFixed(2)),
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      categoryBreakdown,
      monthlySales,
      lowStockAlerts,
      topSellingProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };

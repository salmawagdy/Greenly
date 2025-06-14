import userModel from "../../../DB/model/userModel.js";
import LicenseModel from "../../../DB/model/license.model.js";
import Product from "../../../DB/model/product.model.js";
import blogModel from "../../../DB/model/blog.model.js";
import loanModel from "../../../DB/model/loan.model.js";
import orderModel from "../../../DB/model/order.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      usersCount,
      approvedLicenses,
      productsCount,
      blogsCount,
      approvedLoansCount,
      ordersCount,
    ] = await Promise.all([
      userModel.countDocuments({ role: { $ne: "admin" } }),
      LicenseModel.countDocuments({ status: "approved" }),
      Product.countDocuments(),
      blogModel.countDocuments(),
      loanModel.countDocuments({ loanStatus: "approved" }),
      orderModel.countDocuments(),
    ]);

    return res.status(200).json({
      users: usersCount,
      approvedLicenses,
      products: productsCount,
      blogs: blogsCount,
      approvedLoans: approvedLoansCount,
      orders: ordersCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
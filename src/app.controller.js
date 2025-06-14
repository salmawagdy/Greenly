import { connectDB } from "../src/DB/connection.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import blogController from "./modules/blog/blog.controller.js";
import licenseController from "./modules/license/license.controller.js";
import productRouter from "./modules/product/product.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subCategoryRouter from "./modules/subCategories/subCategories.controller.js";
import cartRouter from "./modules/cartshopping/cart.controller.js";
import wishlist from "./modules/wishList/wishList.controller.js";
import payment from "./modules/payment/payment.controller.js"
import loan from "./modules/loan/loan.controller.js"
import webhook from "./modules/payment/webhook.controller.js"
import address from "./modules/address/address.controller.js"
import dashController from './modules/dashBoard/dashBaord.controller.js'
import { globalErrorHandling } from "./utilis/response/error.response.js";

const bootstrap = async (app, express) => {
  app.use("/webhook",webhook)
  app.use(express.json());

  app.use("/product", productRouter);
  app.use("/category", categoryRouter);
  app.use("/subCategory", subCategoryRouter);
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/blog", blogController);
  app.use("/license", licenseController);
  app.use("/cart", cartRouter);
  app.use("/wishlist", wishlist);
  app.use("/address", address)
  app.use("/payment", payment)
  app.use("/loan", loan)
  app.use('/dash',dashController)



  app.use(globalErrorHandling);
  await connectDB();
};

export default bootstrap;

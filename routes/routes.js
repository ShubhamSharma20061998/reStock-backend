const express = require("express");
const { checkSchema } = require("express-validator");
const {
  userRegisterValidation,
  userLoginValidation,
  userUpdateValidation,
} = require("../app/helpers/users-validation");
const userCtrl = require("../app/controllers/users-ctrl");
const productValidation = require("../app/helpers/products-validation");
const {
  authorization,
  authenticateUser,
} = require("../app/middlewares/authentication");
const productCtrl = require("../app/controllers/products-ctrl");
const shopDetailsCltr = require("../app/controllers/shopDetails-cltr");
const paymentCltr = require("../app/controllers/payment-cltr");
const shopDetails = require("../app/helpers/shopDetails-validation");
const upload = require("../app/middlewares/userRegisterFiles");
const cartValidation = require("../app/helpers/carts-validation");
const cartCltr = require("../app/controllers/carts-cltr");
const ordercltr = require("../app/controllers/orders-ctlr");
const router = express.Router();

//users api's start
// Admin register
router.post(
  "/api/user_register",
  upload.array("certificates"),
  checkSchema(userRegisterValidation),
  userCtrl.register
);
// login
router.post("/api/login", checkSchema(userLoginValidation), userCtrl.login);
// list users
router.get("/api/getAllUsers", userCtrl.listUsers);
// update user
router.put(
  "/api/update_users/:id",
  checkSchema(userUpdateValidation),
  authenticateUser,
  userCtrl.updateUser
);
// delete users
router.delete(
  "/api/delete_user/:id",
  authenticateUser,
  authorization(["admin"]),
  userCtrl.deleteUser
);
//user api's end

// products api's start
//products listing
router.get("/api/getProducts", productCtrl.getAllProducts);
// product creation
router.post(
  "/api/create_product",
  upload.array("images"),
  // upload.array("images",12),
  // checkSchema(productValidation),
  authenticateUser,
  authorization(["admin"]),
  productCtrl.createProduct
);
// remove product
router.delete(
  "/api/remove_product/:id",
  authenticateUser,
  authorization(["admin"]),
  productCtrl.removeProduct
);
// update product
router.put(
  "/api/update_product/:id",
  checkSchema(productValidation),
  authenticateUser,
  authorization(["admin"]),
  productCtrl.updateProduct
);
// products api's end

// shopDetails api's start
// list shops
router.get(
  "/api/getShops",
  authenticateUser,
  // authorization(["admin"]),
  shopDetailsCltr.getAllShops
);
// create shop
router.post(
  "/api/create_shop",
  checkSchema(shopDetails),
  authenticateUser,
  authorization(["admin"]),
  shopDetailsCltr.createAccount
);
// update shop details
router.put(
  "/api/update_shop/:id",
  checkSchema(shopDetails),
  authenticateUser,
  authorization(["admin"]),
  shopDetailsCltr.updateShopDetails
);
//delete shop
router.delete(
  "/api/delete_shop/:id",
  authenticateUser,
  authorization(["admin"]),
  shopDetailsCltr.removeShop
);
// shopDetails api's end

//cart api's start
//list cart items
router.get("/api/getCartItems", authenticateUser, cartCltr.getAllItems);
//create cart item
router.post(
  "/api/create-cart/:id",
  authenticateUser,
  authorization(["user"]),
  checkSchema(cartValidation),
  cartCltr.createItems
);
// delete cart item
router.delete(
  "/api/remove-item/:id",
  authenticateUser,
  authorization(["user"]),
  cartCltr.removeItem
);
//increase item
router.post(
  "/api/increase_quantity/:id",
  authenticateUser,
  authorization(["user"]),
  cartCltr.increaseQuantity
);
// decrease item
router.post(
  "/api/decrease_quantity/:id",
  authenticateUser,
  authorization(["user"]),
  cartCltr.decreaseQuantity
);
//empty cart
router.post(
  "/api/empty-cart",
  authenticateUser,
  authorization(["user"]),
  cartCltr.removeMultipleItems
);
// cart api's end

//payment api
router.post(
  "/api/payment",
  authenticateUser,
  authorization(["user"]),
  paymentCltr.create
);

router.put(
  "/api/payment/:id",
  authenticateUser,
  authorization(["user"]),
  paymentCltr.update
);

router.delete(
  "/api/payment/:id",
  authenticateUser,
  authorization(["user"]),
  paymentCltr.delete
);

router.get(
  "/api/payment",
  authenticateUser,
  authorization(["user"]),
  paymentCltr.list
);
// payment api's end

// orders api's start
// list owner orders
router.get(
  "/api/getPendingOrders",
  // authenticateUser,
  // authorization(["admin"]),
  ordercltr.listOwnerOrders
),
  //create
  router.post(
    "/api/create-order",
    // authenticateUser,
    // authorization(["user"]),
    ordercltr.create
  );
//update
router.put(
  "/api/update-order/:id",
  // authenticateUser,
  // authorization(["admin"]),
  ordercltr.update
);
//delete
router.delete(
  "/api/reject-order/:id",
  // authenticateUser,
  // authorization(["admin"])
  ordercltr.delete
);
//list orders
router.get(
  "/api/getAllOrders",
  // authenticateUser,
  // authorization(["admin"]),
  ordercltr.list
);
//list user order
router.get(
  "/api/orders/:id",
  // authenticateUser,
  // authorization(["user"]),
  ordercltr.getUserOrder
);

// orders api's end

module.exports = router;

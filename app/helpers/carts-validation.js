const cartValidation = {
  productID: {
    notEmpty: {
      errorMessage: "product is required",
    },
  },
  userID: {
    notEmpty: {
      errorMessage: "userID is required",
    },
  },
};
module.exports = cartValidation;

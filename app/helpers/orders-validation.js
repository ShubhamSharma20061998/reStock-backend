const orderOwner = {
  isMongoId: {
    errorMessage: "order owner type mismatch",
  },
};

const lineItems = {
  isArray: {
    errorMessage: "line items type mismatch",
  },
  custom: {
    options: value => {
      const result = value.every(el => {
        return el.items.length > 0 && el.quantity > 0 && el.amount > 0;
      });
      if (!result) {
        throw new Error("line items cannot be empty");
      } else {
        return true;
      }
    },
  },
};

const ordersValidation = {};

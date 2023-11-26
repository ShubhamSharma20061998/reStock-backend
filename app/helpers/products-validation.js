const brandNameSchema = {
  notEmpty: {
    errorMessage: "brand name is required",
  },
  isLength: {
    options: { min: 3 },
    errorMessage: "atleast 3 characters are required",
  },
};

const productReleaseDateSchema = {
  custom: {
    options: async (value, { req }) => {
      if (req.body.isNewProducts) {
        throw new Error("product release date is required");
      } else {
        return true;
      }
    },
  },
};

const unitTypeSchema = {
  notEmpty: {
    errorMessage: "unit type is required",
  },
};

const stocksSchema = {
  notEmpty: {
    errorMessage: "stocks cannot be empty",
  },
};

const titleSchema = {
  notEmpty: {
    errorMessage: "title is required",
  },
};

const imagesSchema = {
  isArray: {
    options: { min: 1 },
    errorMessage: "atleast one image is requried",
  },

  // custom: {
  //   options: async value => {
  //     const url = value.every(el => {
  //       return el.url.length > 0;
  //     });
  //     if (!url) {
  //       throw new Error("url is required");
  //     } else {
  //       return true;
  //     }
  //   },
  // },
};

const priceSchema = {
  notEmpty: {
    errorMessage: "price is required",
  },
};

const descriptionSchema = {
  notEmpty: {
    errorMessage: "description is required",
  },
  isLength: {
    options: { min: 35 },
    errorMessage: "atleast 35 words are requried",
  },
};

const ratingSchema = {
  notEmpty: {
    errorMessage: "rating is required",
  },
};

const categorySchema = {
  notEmpty: {
    errorMessage: "category cannot be empty",
  },
  isMongoId: {
    errorMessage: "should be a valid category",
  },
};

const maxOrderUnitSchema = {
  notEmpty: {
    errorMessage: "max order unit is required",
  },
};

const minOrderUnitSchema = {
  notEmpty: {
    errorMessage: "minimum order unit is required",
  },
};

const productValidation = {
  brandName: brandNameSchema,
  unitType: unitTypeSchema,
  stocks: stocksSchema,
  title: titleSchema,
  images: imagesSchema,
  "images.*.url": {
    isLength: {
      options: { min: 6 },
      errorMessage: "url is required",
    },
  },
  price: priceSchema,
  description: descriptionSchema,
  rating: ratingSchema,
  // category: categorySchema,
  maxOrderUnit: maxOrderUnitSchema,
  minOrderUnit: minOrderUnitSchema,
  // productReleaseDate: productReleaseDateSchema,
};

module.exports = productValidation;

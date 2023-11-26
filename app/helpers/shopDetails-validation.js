const shopNameSchema = {
  notEmpty: {
    errorMessage: "shop name is required",
  },
  isLength: {
    options: { min: 8 },
    errorMessage: "shop name must be atleast 8 characters",
  },
};

const ownerFirstNameSchema = {
  notEmpty: {
    errorMessage: "owner first name is required",
  },
  isLength: {
    options: { min: 2, max: 40 },
    errorMessage: "owner first name should be atleast 2 - 40 characters",
  },
};

const ownerLastNameSchema = {
  notEmpty: {
    errorMessage: "owner last name is required",
  },
};

const contactSchema = {
  notEmpty: {
    errorMessage: "contact is required",
  },
  isMobilePhone: {
    options: ["any"],
    errorMessage: "invalid format",
  },
};

const alternateContactSchema = {
  notEmpty: {
    errorMessage: "contact is required",
  },
  isMobilePhone: {
    options: ["any"],
    errorMessage: "invalid format",
  },
};

const shopAddressSchema = {
  isArray: {
    options: { min: 1 },
    errorMessage: "atleast one address is required",
  },
};
// custom: {
//   options: async value => {
//     const mobileFormat =
//       /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
//     const result = value.every(el => {
//       return mobileFormat.test(el.contact);
//     });
//     if (!result) {
//       throw new Error("Invalid format");
//     } else {
//       return true;
//     }
//   },
// },
// custom: {
//   options: async value => {
//     const result = value.every(el => {
//       return el.contact.length > 0 && el.contact.length <= 10;
//     });
//     if (!result) {
//       throw new Error("Invalid format");
//     } else {
//       return true;
//     }
//   },
// },
// custom: {
//   options: async value => {
//     const mobileFormat =
//       /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
//     const result = value.every(el => {
//       return mobileFormat.test(el.alternateContact);
//     });
//     if (!result) {
//       throw new Error("Invalid format");
//     } else {
//       return true;
//     }
//   },
// },
// custom: {
//   options: async value => {
//     const result = value.every(el => {
//       return (
//         el.alternateContact.length > 0 && el.alternateContact.length <= 10
//       );
//     });
//     if (!result) {
//       throw new Error("Invalid format");
//     } else {
//       return true;
//     }
//   },
// },

const gstNoSchema = {
  notEmpty: {
    errorMessage: "gstNo is required",
  },
};

const ownerSchema = {
  isMongoId: {
    errorMessage: "owner type mismatch",
  },
};

const shopDetails = {
  shopName: shopNameSchema,
  ownerFirstName: ownerFirstNameSchema,
  ownerLastName: ownerLastNameSchema,
  contact: contactSchema,
  alternateContact: alternateContactSchema,
  shopAddress: shopAddressSchema,

  "shopAddress.*.fullAddress": {
    notEmpty: {
      errorMessage: "Address is required",
    },
    isLength: {
      options: { min: 25 },
      errorMessage: "Address should be atleast 25 characters",
    },
  },
  "shopAddress.*.pincode": {
    matches: {
      options: /^[1-9][0-9]{5}$/,
      errorMessage: "Invalid pincode",
    },
  },
  "shopAddress.*.shopContact": {
    isMobilePhone: {
      options: ["any"],
      errorMessage: "invalid format",
    },
    optional: {
      options: {
        nullable: true,
      },
    },
  },
  gstNo: gstNoSchema,
  // owner: ownerSchema,
};

module.exports = shopDetails;

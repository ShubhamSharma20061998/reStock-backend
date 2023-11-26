const User = require("../models/users-model");

const usernameRegisterSchema = {
  notEmpty: {
    errorMessage: "username is required",
  },
  isLength: {
    options: { min: 8, max: 28 },
    errorMessage: "username should be 8 - 28 characters",
  },
};

const passwordLoginSchema = {
  notEmpty: {
    errorMessage: "username is required",
  },
};

const passwordRegisterSchema = {
  notEmpty: {
    errorMessage: "password is required",
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      maxLength: 128,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage:
      "password should contain 8 - 128 characters with atleast one lowercase, uppercase ,number and symbol",
  },
};

const emailRegisterSchema = {
  notEmpty: {
    errorMessage: "email is required",
  },
  isEmail: {
    errorMessage: "invalid email format",
  },
  custom: {
    options: async value => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email already registered");
      } else {
        return true;
      }
    },
  },
};

const userRegisterValidation = {
  username: usernameRegisterSchema,
  password: passwordRegisterSchema,
  email: emailRegisterSchema,
};

const userUpdateValidation = {
  username: usernameRegisterSchema,
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    isEmail: {
      errorMessage: "invalid email format",
    },
  },
};

const usernameEmailSchema = {
  custom: {
    options: async value => {
      const user = await User.findOne({
        $or: [{ email: value }, { username: value }],
      });
      if (!user) {
        throw new Error("invalid username / email or password");
      } else {
        return true;
      }
    },
  },
};

const userLoginValidation = {
  usernameOrEmail: usernameEmailSchema,
  password: passwordLoginSchema,
};

module.exports = {
  userLoginValidation,
  userRegisterValidation,
  userUpdateValidation,
};

const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
const { PrismaClient } = require("@prisma/client");
const {
  generateHashPassword,
  checkHashPassword,
} = require("../utils/hashPassword");
const {
  generateToken,
  generateVerifyToken,
  verifyJwtToken,
  decodeJwtToken,
} = require("../utils/tokenManager");
const { sendEmail } = require("../utils/sendEmail");
const config = require("../config/config");
const prisma = new PrismaClient();

const generateJwtToken = async (userInfo) => {
  let tokenData = {
    email: userInfo?.email,
    name: userInfo?.name,
    _id: userInfo?.id,
    role: userInfo?.role,
  };

  const token = await generateVerifyToken(tokenData);

  return token;
};

const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!name || !email || !password) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide required data"
      );
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (checkEmail) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Email already exist"
      );
    }

    const hashPass = await generateHashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashPass,
      },
    });

    const token = await generateJwtToken(newUser);

    //sending verification email

    sendEmail(newUser?.email, token);

    return response(
      res,
      StatusCodes.CREATED,
      true,
      {},
      "Signup success.Please verify your email"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide required data"
      );
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!checkEmail) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Email not exist"
      );
    } else if (!checkEmail?.isVerify) {
      const token = await generateJwtToken(checkEmail);
      //sending verification email

      sendEmail(checkEmail?.email, token);
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Email not verified. verification email sent"
      );
    }

    const checkPass = await checkHashPassword(password, checkEmail?.password);

    if (!checkPass) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Invalid password"
      );
    }

    let tokenData = {
      email: checkEmail?.email,
      name: checkEmail?.name,
      _id: checkEmail?.id,
      role: checkEmail?.role,
    };

    const token = await generateToken(tokenData);

    return response(res, StatusCodes.CREATED, true, { token }, "login success");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide required data"
      );
    }

    const isValidToken = await verifyJwtToken(token.split(" ")[1]);

    if (!isValidToken) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Invalid token"
      );
    }

    const userInfo = await decodeJwtToken(token);

    const checkEmail = await prisma.user.findUnique({
      where: { email: userInfo?.email },
    });

    if (!checkEmail) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Email not exist"
      );
    }

    await prisma.user.update({
      where: { email: userInfo?.email },
      data: { isVerify: true },
    });

    res.redirect(StatusCodes.MOVED_TEMPORARILY, config.loginUrl);

    return response(res, StatusCodes.CREATED, true, {}, "Email verified");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide required data"
      );
    }

    const hashPass = await generateHashPassword(password);

    await prisma.user.update({
      where: { email: email },
      data: { password: hashPass },
    });

    return response(res, StatusCodes.CREATED, true, {}, "Password updated");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

module.exports = { signUp, signIn, verifyEmail, forgotPassword };

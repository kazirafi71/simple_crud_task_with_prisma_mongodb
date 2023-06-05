const { PrismaClient } = require("@prisma/client");
const { response } = require("../utils/response");
const { StatusCodes } = require("http-status-codes");
const { generateHashPassword } = require("../utils/hashPassword");

const prisma = new PrismaClient();

const userRegistration = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

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

    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashPass,
        role: role,
      },
    });

    return response(res, StatusCodes.CREATED, true, {}, "New user created");
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:23 ~ userRegistration ~ error:",
      error
    );
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return response(res, StatusCodes.OK, true, { users }, "success");
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:23 ~ userRegistration ~ error:",
      error
    );
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Something went wrong"
    );
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide userId"
      );
    }

    if (req.user?.role === "User") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.role === "Admin" || user?.role === "Support") {
        return response(
          res,
          StatusCodes.METHOD_NOT_ALLOWED,
          false,
          {},
          "You are not allowed"
        );
      }
      await prisma.user.delete({
        where: { id: req.user?._id },
      });
    } else if (req.user?.role === "Support") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.role === "Admin") {
        return response(
          res,
          StatusCodes.METHOD_NOT_ALLOWED,
          false,
          {},
          "You are not allowed"
        );
      }
      await prisma.user.delete({
        where: { id: userId },
      });
    } else {
      await prisma.user.delete({
        where: { id: userId },
      });
    }

    return response(res, StatusCodes.OK, true, {}, "User deleted");
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

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const { name, role } = req.body;
    const updatedData = {};

    if (name) {
      updatedData.name = name;
    }

    if (role) {
      updatedData.role = role;
    }

    if (!userId) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Please provide userId"
      );
    }

    if (req.user?.role === "User") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.role === "Admin" || user?.role === "Support") {
        return response(
          res,
          StatusCodes.METHOD_NOT_ALLOWED,
          false,
          {},
          "You are not allowed"
        );
      }
      await prisma.user.update({
        where: { id: req.user?._id },
        data: updatedData,
      });
    } else if (req.user?.role === "Support") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user?.role === "Admin") {
        return response(
          res,
          StatusCodes.METHOD_NOT_ALLOWED,
          false,
          {},
          "You are not allowed"
        );
      }
      await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });
    }

    return response(res, StatusCodes.OK, true, {}, "User data updated");
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

module.exports = { userRegistration, listUsers, deleteUser, updateUser };

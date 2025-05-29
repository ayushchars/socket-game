import { compairPassword, hashPassword } from "../../helpers/authHelper.js";
import userModel from "../../models/userModel.js";
import Jwt from "jsonwebtoken";
import {
  ErrorResponse,
  successResponse,
  notFoundResponse,
  successResponseWithData
} from "../../helpers/apiResponse.js";
export const register = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ErrorResponse(res, "User already Exist");
    }

    const hashedPassword = await hashPassword(password);

     await new userModel({
      name,
      email,
      role,
      password: hashedPassword,
    }).save();
    return successResponse(res, "User created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while Registering",
      err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return notFoundResponse(res, "Email or Password wrong");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return notFoundResponse(res, "Email  not found");
     
    }
        if (user.isBlocked) {
      return ErrorResponse(res, "You are blocked by the admin. Please contact support.");
    }


    const match = await compairPassword(password, user.password);

    if (!match) {
      return ErrorResponse(res, " Password wrong");
     
    }
    const additionalData = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      role: user.role,
    };
    const jwtPayload = { _id: user._id, ...additionalData };

    const token = await Jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return successResponseWithData(res, "Login successfully",{
      user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
      }, token
  });
    
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while login.....",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();

    return successResponseWithData(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Error occurred while fetching users:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
    });
  }
};
export const getUserbyId = async (req, res) => {
  try {
    const {id} = req.body;
    const users = await userModel.findById(id);

    return successResponseWithData(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Error occurred while fetching users:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
    });
  }
};

export const block = async (req, res) => {
  try {
    const { id, isBlocked } = req.body;

    if (!id || typeof isBlocked !== "boolean") {
      return ErrorResponse(res, "User ID and isBlocked (true/false) are required");
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    const statusMsg = isBlocked ? "blocked" : "unblocked";
    return successResponseWithData(res, `User successfully ${statusMsg}`, user);

  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const editUser = async (req, res) => {
  try {
    const { id, name, email, points } = req.body;

    if (!id) {
      return ErrorResponse(res, "User ID is required");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, points },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return notFoundResponse(res, "User not found");
    }

    return successResponseWithData(res, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return ErrorResponse(res, "Internal Server Error");
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return ErrorResponse(res, "All fields are required");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ErrorResponse(res, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return successResponseWithData(res, "User created successfully by admin", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });

  } catch (error) {
    console.error("Admin create user error:", error);
    return ErrorResponse(res, "Internal Server Error");
  }
};
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return ErrorResponse(res, "User ID is required");
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return notFoundResponse(res, "User not found");
    }

    return successResponseWithData(res, "User deleted successfully", {
      id: deletedUser._id,
      name: deletedUser.name,
      email: deletedUser.email,
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return ErrorResponse(res, "Internal Server Error");
  }
};
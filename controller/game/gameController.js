import userModel from "../../models/userModel.js";
import {
  ErrorResponse,
  successResponseWithData,
  notFoundResponse,
} from "../../helpers/apiResponse.js";

export const getUserPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("name points");

    if (!user) return notFoundResponse(res, "User not found");

    return successResponseWithData(res, "User points fetched", user);
  } catch (error) {
    console.error("Error fetching user points:", error);
    return ErrorResponse(res, "Error fetching user points");
  }
};

export const getRankings = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: "USER" })
      .sort({ points: -1 })
      .select("isOnline name points ");

    return successResponseWithData(res, "Ranking fetched", users);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return ErrorResponse(res, "Error fetching rankings");
  }
};


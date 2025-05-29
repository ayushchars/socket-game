import { Server } from "socket.io";
import userModel from "./models/userModel.js";

const userSockets = {};

const updateUserStatus = async (userId, isOnline) => {
  try {
    await userModel.findByIdAndUpdate(userId, { isOnline });
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};

const emitRankings = async (io) => {
  try {
    const rankings = await userModel
      .find({ role: "USER" })
      .sort({ points: -1 })
      .select("name points isOnline");

    io.emit("ranking:update", rankings);
  } catch (error) {
    console.error("Error emitting rankings:", error);
  }
};

const emitActiveUsers = async (io) => {
  try {
    const activeUsers = await userModel
      .find({ isOnline: true, role: "USER" })
      .select("name email points");

    io.emit("admin:activeUsers", activeUsers);
  } catch (error) {
    console.error("Error emitting active users:", error);
  }
};

const initSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", async (userId) => {
      if (!userId) return;

      userSockets[userId] = socket.id;
      await updateUserStatus(userId, true);

      io.emit("userStatusChanged", { userId, isOnline: true });

      await emitActiveUsers(io);
      await emitRankings(io);
    });
    socket.on("banana:click", async (userId) => {
      try {

        const user = await userModel.findById(userId);

        if (!user) {
          return socket.emit("error", "User not found");
        }
        if (user.isBlocked) {
          return socket.emit("actionBlocked", "You are blocked from earning points");
        }
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { $inc: { points: 1 } },
          { new: true }
        );

        socket.emit("player:updateClickCount", updatedUser.points);

        await emitRankings(io);
      } catch (error) {
        console.error("Error processing banana click:", error);
      }
    });

    socket.on("disconnect", async () => {
      const userId = Object.keys(userSockets).find(
        (id) => userSockets[id] === socket.id
      );

      if (userId) {
        delete userSockets[userId];
        await updateUserStatus(userId, false);

        io.emit("userStatusChanged", { userId, isOnline: false });
        await emitActiveUsers(io);
      }
    });
  });
};

export default initSocket;

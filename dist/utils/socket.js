"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotificationForChangeUserRole = exports.emitNotificationForCreateStickers = exports.emitNotification = exports.initSocketIO = void 0;
const user_model_1 = require("../modules/basic_modules/user/user.model");
const notification_model_1 = require("../modules/basic_modules/notifications/notification.model");
let io;
// Initialize Socket.IO
const initSocketIO = (server) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Initializing Socket.IO server...");
    const { Server } = yield Promise.resolve().then(() => __importStar(require("socket.io")));
    io = new Server(server, {
        // Assign the initialized io instance to the io variable
        cors: {
            origin: "*", // Replace with your client's origin
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"], // Add any custom headers if needed
            credentials: true, // If your client requires credentials
        },
    });
    console.log("Socket.IO server initialized!");
    io.on("connection", (socket) => {
        console.log("Socket just connected:", socket.id);
        // Listen for messages from the client
        socket.on("clientMessage", (message) => {
            console.log("Message received from client:", message);
            // Optionally, send a response back to the client
            socket.emit("serverMessage", `Server received: ${message}`);
        });
        socket.on("disconnect", () => {
            console.log(socket.id, "just disconnected");
        });
    });
});
exports.initSocketIO = initSocketIO;
// Emit Notification to User and Admin
// export const emitNotification = async ({
//   userId,
//   userMsg,
//   adminMsg,
// }: {
//   userId: string;
//   userMsg: ILocalizedString;
//   adminMsg: ILocalizedString;
// }): Promise<void> => {
//   if (!io) {
//     throw new Error("Socket.IO is not initialized");
//   }
//   // Get admin IDs
//   const admins = await UserModel.find({ role: "admin" }).select("_id");
//   const adminIds = admins.map((admin) => admin._id.toString());
//   // Notify the specific user
//   if (userMsg) {
//     io.emit(`notification::${userId}`, {
//       userId,
//       message: userMsg,
//     });
//   }
//   // Notify all admins
//   if (adminMsg) {
//     adminIds.forEach((adminId) => {
//       io.emit(`notification::${adminId}`, {
//         adminId,
//         message: adminMsg,
//       });
//     });
//   }
//   // Save notification to the database
//   await NotificationModel.create<INotification>({
//     userId,
//     adminId: adminIds,
//     adminMsg: adminMsg,
//     userMsg: userMsg ,
//   });
// };
const emitNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, userMsg, adminMsg, }) {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    // Get admin IDs
    const admins = yield user_model_1.UserModel.find({ role: "admin" }).select("_id");
    const adminIds = admins.map((admin) => admin._id.toString());
    // Notify the specific user
    if (userMsg) {
        io.emit(`notification::${userId}`, {
            userId,
            message: userMsg, // userMsg is passed as ILocalizedString (plain object)
        });
    }
    // Notify all admins
    if (adminMsg) {
        adminIds.forEach((adminId) => {
            io.emit(`notification::${adminId}`, {
                adminId,
                message: adminMsg, // adminMsg is passed as ILocalizedString (plain object)
            });
        });
    }
    // Save notification to the database
    yield notification_model_1.NotificationModel.create({
        userId,
        adminId: adminIds,
        adminMsg: adminMsg, // Stored as ILocalizedString
        userMsg: userMsg, // Stored as ILocalizedString
    });
});
exports.emitNotification = emitNotification;
// Emit Notification for All Users
const emitNotificationForCreateStickers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userMsg, }) {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    // Get all users with role "user" (exclude admins)
    const users = yield user_model_1.UserModel.find({ role: "user" }).select("_id");
    const userIds = users.map((user) => user._id.toString());
    // Notify all users
    if (userMsg) {
        userIds.forEach((userId) => {
            io.emit(`notification::${userId}`, {
                userId,
                message: userMsg,
            });
        });
    }
    // Save notification to the database for each user
    const notifications = userIds.map((userId) => ({
        userId,
        userMsg,
    }));
    yield notification_model_1.NotificationModel.insertMany(notifications); // Save all notifications
});
exports.emitNotificationForCreateStickers = emitNotificationForCreateStickers;
// Emit Notification for User Role Change
const emitNotificationForChangeUserRole = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, userMsg, }) {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    // Notify the specific user
    if (userMsg) {
        io.emit(`notification::${userId}`, {
            userId,
            message: userMsg,
        });
    }
    // Save the notification to the database
    yield notification_model_1.NotificationModel.create({
        userId,
        userMsg,
    });
});
exports.emitNotificationForChangeUserRole = emitNotificationForChangeUserRole;

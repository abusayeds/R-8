// global.d.ts
// import { JwtPayload } from "jsonwebtoken";
import { Server as SocketIo } from "socket.io";

declare global {
  namespace NodeJS {
    interface Global {
      io: SocketIo;
    }

  }
}
// import { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       user: JwtPayload;
//     }
//   }
// }
// declare module "express-serve-static-core" {
//   interface Request {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//     }
//   }
// }
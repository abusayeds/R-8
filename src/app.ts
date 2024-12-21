/* eslint-disable @typescript-eslint/no-explicit-any */
// import path from "path";
// Import the 'express' module
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userVisitModel } from "./modules/make_modules/admin/adminModel"; 
import { logger, logHttpRequests } from "./logger/logger"; 
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(logHttpRequests);
app.use(router);
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let visitor = await userVisitModel.findOne(); 
    if (!visitor) {
      visitor = new userVisitModel();
    }
    const visitorId = req.cookies.visitorId; 
    if (!visitorId) {
      const newVisitorId = `visitor_${Date.now()}`;
      res.cookie("visitorId", newVisitorId, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });
      visitor.count += 1;
      visitor.uniqueVisitors.push(newVisitorId);
      await visitor.save(); 
    }
    next(); 
  } catch (err) {
    console.error("Error updating visitor count", err);
    next(); 
  }
});
const resetVisitorData = async () => {
  try {
    setInterval(async () => {
      const visitor = await userVisitModel.findOne();
      if (visitor) {
        visitor.count = 0;
        visitor.uniqueVisitors = [];
        await visitor.save();
        console.log('Visitor count and list reset successfully!');
      }
    }, 86400000); 
  } catch (err) {
    console.error("Error resetting visitor data:", err);
  }
};
resetVisitorData();

app.get("/", async (req: Request, res: Response) => {
  logger.info("Root endpoint hit");
  const response = `
    <h1 style="text-align:center">Hello</h1>
    <h2 style="text-align:center">Welcome to the Server</h2>
  `;
  res.status(200).send(response);
});
app.get("/", async (req: Request, res: Response) => {
  logger.info("Root endpoint hit");
  const response = `
    <h1 style="text-align:center">Hello</h1>
    <h2 style="text-align:center">Welcome to the Server</h2>
  `;
  res.status(200).send(response);
});

app.all("*", notFound);
app.use(globalErrorHandler);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
  next(err);
});

export default app;





// cron.schedule("0 0 * * *", async () => {
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     await userVisitModel.deleteMany({ date: { $lt: today } });
//     console.log("Old user visit records cleared.");
//   } catch (error) {
//     console.error("Error clearing user visit records:", error);
//   }
// });
/* eslint-disable @typescript-eslint/no-explicit-any */
// import path from "path";
// Import the 'express' module
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import { logger, logHttpRequests } from "./logger/logger";
import useragent from "useragent";
import cron from "node-cron";
import UserVisit from "./modules/make_modules/admin/adminApproveModel";
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
app.get("/", async (req: Request, res: Response) => {
  logger.info("Root endpoint hit");
  const today = new Date().toISOString().split("T")[0];
  const agent = useragent.parse(req.headers["user-agent"] || "");
  const deviceName = `${agent.family} ${agent.os}`;

  try {
    let userVisit = await UserVisit.findOne({ date: today, deviceName });

    if (!userVisit) {
      userVisit = new UserVisit({ date: today, deviceName, count: 1 });
    } else {
      userVisit.count += 1;
    }

    await userVisit.save();

    // Combine the response for the user visit tracking and welcome template
    const response = `
        <h1 style="text-align:center">Hello</h1>
        <h2 style="text-align:center">Welcome to the Server</h2>
        <p style="text-align:center">User visit tracked:</p>
        <p style="text-align:center">Date: ${userVisit.date}</p>
        <p style="text-align:center">Device: ${userVisit.deviceName}</p>
        <p style="text-align:center">Visit Count: ${userVisit.count}</p>
      `;
    res.status(200).send(response);
  } catch (error) {
    logger.error("Error tracking user visit", { error });
    res.status(500).send({ message: "Error tracking user visit", error });
  }
});

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    await UserVisit.deleteMany({ date: { $lt: today } });
    console.log("Old user visit records cleared.");
  } catch (error) {
    console.error("Error clearing user visit records:", error);
  }
});
app.all("*", notFound);
app.use(globalErrorHandler);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
  next(err);
});

export default app;

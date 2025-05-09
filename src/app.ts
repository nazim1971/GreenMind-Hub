
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './middlewires/globalErrorHandler';
import { notFoundError } from './middlewires/notFoundError';
import cookieParser from 'cookie-parser';
import os from 'os'

const app: Application = express();
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get("/", (req: Request, res: Response) => {
    const currentDateTime = new Date().toISOString();
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  
    const serverDetails = {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: formatUptime(os.uptime()),
    };
  
    const clientDetails = {
      ipAddress: clientIp,
      accessedAt: currentDateTime,
    };
  
    const developerContact = {
      email: ["nazimmuddin10@gmail.com"],
    };
  
    res.status(200).send({
      success: true,
      message: "Welcome to GreenMind Hub Server",
      version: "1.0.0",
      clientDetails,
      serverDetails,
      developerContact,
    });
  });
  
  // Helper function to format uptime
  function formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  }

  
app.use('/api', router);

app.use(globalErrorHandler);
app.use(notFoundError)

export default app;
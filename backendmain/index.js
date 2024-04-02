import express from "express";
import mongoose from "mongoose";
import Loginroutes from "./Routes/Loginroutes.js";
import Pdfroutes from "./Routes/Pdfroutes.js";
import Dashboardroutes from "./Routes/Dashboardroutes.js";
import Companyroutes from "./Routes/Companyroutes.js";
import EditProfileRoutes from "./Routes/Editprofileroutes.js";
import AcceptRoutes from "./Routes/Acceptroutes.js";
import Sentroutes from "./Routes/Sentroutes.js";
import Receivedroutes from "./Routes/Receivedroutes.js";
import RejectRoutes from "./Routes/Rejectroutes.js";
import Signuproutes from "./Routes/Signuproutes.js";
import Empcredentialsroutes from "./Routes/Empcredentialsroutes.js";
import job, {jobDaily, jobMonthly} from "./cron.js";

import Requestrefroutes from "./Routes/Requestrefroutes.js";
import * as env from "dotenv";
env.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Set CORS headers to allow cross-origin requests (required to communicate with flutter thorugh localhosting)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, PUT, GET, DELETE"
  );
  next();
});

try {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connected");
  });
} catch (e) {
  console.log(e);
}
app.use("/api", Loginroutes);
app.use("/api", EditProfileRoutes);
app.use("/api", Pdfroutes);
app.use("/api", Dashboardroutes);
app.use("/api", Companyroutes);
app.use("/api", AcceptRoutes);
app.use("/api", RejectRoutes);
app.use("/api", Receivedroutes);
app.use("/api", Requestrefroutes);
app.use("/api", Sentroutes);
app.use("/api", Signuproutes);
app.use("/api", Empcredentialsroutes);
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log("started " + port);
});

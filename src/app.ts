import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import path from "path";

import { errorHandler, notFound } from "./middleware/error.middleware";
import photoRoutes from "./routes/photo.routes";
import userRoutes from "./routes/user.routes";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use(
  express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
);
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/photo", photoRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;

require("express-async-errors");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError.js");
const uploadConfig = require("./configs/upload.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5175", "http://localhost:3000", "http://192.168.25.8:8080", "https://mim-systen-front-end.vercel.app"],
  credentials: true
}));

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((err, request, response, next) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }
  
    console.error(err);
  
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
});


const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
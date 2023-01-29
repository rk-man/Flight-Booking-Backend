const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const flightRouter = require("./routes/flightRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(
    express.json({
        limit: "50mb",
    })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/flights", flightRouter);
app.use("/api/v1/bookings", bookingRouter);

module.exports = app;

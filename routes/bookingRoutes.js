const express = require("express");
const userController = require("./../controllers/userController");
const bookingController = require("./../controllers/bookingController");
const router = express.Router();
router.post("/create-booking", bookingController.onPaymentCompletion);
router.use(userController.protect);
router.post(
    "/create-checkout-session",
    bookingController.createCheckoutSession
);
router.get("/", bookingController.getAllBookings);

module.exports = router;

const express = require("express");
const flightController = require("./../controllers/flightController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.use(userController.protect);
router.post(
    "/import-flights",

    flightController.createMultipleFlights
);

router
    .route("/")
    .post(flightController.createFlight)
    .get(flightController.getAllFlightsOnSpecifiedParams);

router.get("/all-cities", flightController.getAllFlightCities);

router.get("/:id", flightController.getFlight);
module.exports = router;

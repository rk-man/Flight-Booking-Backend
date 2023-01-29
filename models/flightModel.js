const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Flight name is a must"],
        },

        sourceLoc: {
            type: String,
            required: [true, "source loc name is a must"],
        },

        sourceLocAirport: {
            type: String,
            required: [true, "source location must have a airport"],
        },

        destinationLoc: {
            type: String,
            required: [true, "Destination location is a must"],
        },

        destinationLocAirport: {
            type: String,
            required: [true, "Destination location must have a airport"],
        },
        sourceTime: {
            type: Date,
            required: [true, "Must have departure time"],
        },

        arrivalTime: {
            type: Date,
            required: [true, "Must have arrival time"],
        },
        ticketsAvailable: {
            type: Number,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);


const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        flight: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Must be associated with a flight"],
            ref: "Flight",
        },

        owner: {
            type: mongoose.Schema.ObjectId,
            required: [true, "Must be associated with a flight"],
            ref: "User",
        },

        passengers: {
            type: [
                {
                    name: {
                        type: String,
                        required: [true, "Must enter passenger name"],
                    },
                    age: {
                        type: Number,
                        required: [true, "Must enter passenger age"],
                    },
                },
            ],
            required: [true, "Must have passengers"],
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        totalPrice: {
            type: Number,
            required: [true, "Must have total Price"],
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: "flight",
    });
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

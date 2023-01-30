const Flight = require("../models/flightModel");
const Booking = require("./../models/bookingModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.createCheckoutSession = async (req, res, next) => {
    let { passengers, flight, totalPrice } = req.body;

    let flightData = await Flight.findById(flight);

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: flightData.name,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/`,
        cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    const booking = await Booking.create({
        passengers,
        flight,
        totalPrice,
        isPaid: true,
        owner: req.user._id,
    });

    return res.status(200).json({
        status: "success",
        url: session.url,
    });
};

exports.createBooking = async (req, res, next) => {
    try {
        const booking = Booking.create({
            ...req.body,
            owner: req.user._id,
            isPaid: true,
        });

        return res.status(200).json({
            status: "success",
            booking,
        });
    } catch (err) {
        return res.status(400).json({
            err,
            status: fail,
            message: "Couldn't create booking",
        });
    }
};

exports.onPaymentCompletion = async (req, res, next) => {
    const event = req.body;

    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
            console.log("PaymentIntent was successful!");
            break;
        case "payment_method.attached":
            const paymentMethod = event.data.object;
            console.log(paymentIntent);
            console.log("PaymentMethod was attached to a Customer!");
            break;
        case "payment_intent.payment_failed":
            console.log("payment failed");
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({
        status: "success",
    });
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ owner: req.user._id }).sort({
            createdAt: -1,
        });
        return res.status(200).json({
            status: "success",
            bookings,
        });
    } catch (err) {
        return res.status(400).json({
            err,
            status: fail,
            message: "Couldn't get All bookings",
        });
    }
};

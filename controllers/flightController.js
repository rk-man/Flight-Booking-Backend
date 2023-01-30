const Flight = require("./../models/flightModel");
// const airportCodes = require("airport-codes");
// const airlineCodes = require("airline-codes");
// const routes = require("./../config/convertToObject");
var randomDate = require("random-datetime");

exports.createFlight = async (req, res, next) => {
    try {
        const flight = await Flight.create(req.body);
        return res.status(200).json({
            status: "success",
            flight,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't create flight",
            err,
        });
    }
};

exports.getAllFlights = async (req, res, next) => {
    try {
        const flights = await Flight.find();
        return res.status(200).json({
            status: "success",
            flights,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Couldn't get all flights",
            err,
        });
    }
};

const getRandom = (start, end) => {
    return Math.floor(Math.random() * (end - start) + start);
};

// exports.createMultipleFlights = async (req, res, next) => {
//     let results = [];
//     for (i = 20000; i < 30000; i++) {
//         let curObj = routes[i];
//
//         // if (curObj.sourceairport === "MAA") {
//         //     let sourceAirport = airportCodes
//         //         .findWhere({ iata: curObj.sourceairport })
//         //         .get("name");
//         //     console.log(sourceAirport);
//         // } else if (curObj.destinationapirport === "MAA") {
//         //     let destinationAirport = airportCodes
//         //         .findWhere({ iata: curObj.destinationapirport })
//         //         .get("name");
//         // }
//
//         if (
//             curObj.airline.length > 0 &&
//             curObj.airlineID.length > 0 &&
//             curObj.sourceairport.length > 0 &&
//             curObj.destinationapirport.length > 0
//         ) {
//             try {
//                 let randomDepartureMonth = getRandom(2, 5);
//                 let randomDepartureDate = randomDate({
//                     year: 2023,
//                     month: randomDepartureMonth,
//                 });
//
//                 let currentTime = randomDepartureDate.getTime();
//                 let hour = getRandom(2, 12);
//                 let arrivalDate = new Date(currentTime + hour * 60 * 60 * 1000);
//                 let sourceAirport = airportCodes
//                     .findWhere({ iata: curObj.sourceairport })
//                     .get("name");
//
//                 let sourceAirportCity = airportCodes
//                     .findWhere({ iata: curObj.sourceairport })
//                     .get("city");
//                 let destinationAirport = airportCodes
//                     .findWhere({ iata: curObj.destinationapirport })
//                     .get("name");
//
//                 let destinatinAirportCity = airportCodes
//                     .findWhere({ iata: curObj.destinationapirport })
//                     .get("city");
//
//                 let airlineName = airlineCodes
//                     .findWhere({ iata: curObj.airline })
//                     .get("name");
//
//                 const flight = await Flight.create({
//                     name: airlineName,
//                     sourceLoc: sourceAirportCity,
//                     destinationLoc: destinatinAirportCity,
//                     sourceLocAirport: sourceAirport,
//                     destinationLocAirport: destinationAirport,
//                     sourceTime: randomDepartureDate,
//                     arrivalTime: arrivalDate,
//                 });
//
//                 results.push(flight);
//             } catch (err) {
//                 continue;
//             }
//         }
//     }
//
//     return res.status(200).json({
//         status: "success",
//         results,
//     });
// };

exports.getAllFlightCities = async (req, res, next) => {
    try {
        let flightCities = [];
        if (req.query.search && req.query.search.length > 0) {
            let pattern = new RegExp(req.query.search, "i");
            console.log(pattern);
            flightCities = await Flight.find({
                sourceLoc: {
                    $regex: pattern,
                },
            }).select("sourceLoc -_id");
            flightCities = flightCities.map((city, index) => {
                return city.sourceLoc;
            });

            flightCities = [...new Set(flightCities)];
        }
        return res.status(200).json({
            status: "Success",
            total: flightCities.length,
            flightCities,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAllAirlines = async (req, res, next) => {
    try {
        let airlines = [];
        if (req.query.search && req.query.search.length > 0) {
            let pattern = new RegExp(req.query.search, "i");

            airlines = await Flight.find({
                name: {
                    $regex: pattern,
                },
            }).select("name -_id");
            airlines = airlines.map((airline, index) => {
                return airline.name;
            });

            airlines = [...new Set(airlines)];
        }
        return res.status(200).json({
            status: "Success",
            total: airlines.length,
            airlines,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAllFlightsOnSpecifiedParams = async (req, res, next) => {
    try {
        let sourceTime = req.query.sourceTime;
        let sourceLoc = new RegExp(req.query.sourceLoc, "i");
        let destinationLoc = new RegExp(req.query.destinationLoc, "i");
        let name = new RegExp(req.query.name, "i");

        if (sourceTime === "null" || sourceTime === "" || !sourceTime) {
            let flights = await Flight.find({
                sourceLoc: {
                    $regex: sourceLoc,
                },
                destinationLoc: {
                    $regex: destinationLoc,
                },
                name: {
                    $regex: name,
                },
            }).sort({ sourceTime: 1 });

            return res.status(200).json({
                status: "Success",
                total: flights.length,
                flights,
            });
        } else {
            let startingDate = new Date(sourceTime);
            let endingDate = new Date(startingDate);
            endingDate = new Date(endingDate.setDate(endingDate.getDate() + 1));

            let flights = await Flight.find({
                sourceLoc: {
                    $regex: sourceLoc,
                },
                sourceTime: {
                    $gte: startingDate,
                    $lt: endingDate,
                },
                destinationLoc: {
                    $regex: destinationLoc,
                },
                name: {
                    $regex: name,
                },
            });

            return res.status(200).json({
                status: "Success",
                total: flights.length,
                flights,
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            message: "couldn;t get all flights",
        });
    }
};

exports.getFlight = async (req, res, next) => {
    try {
        const flight = await Flight.findById(req.params.id);
        return res.status(200).json({
            status: "Success",
            flight,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            message: "couldn;t get  flights",
        });
    }
};

exports.createManyFlights = async (req, res, next) => {
    try {
        let flight = await Flight.findById("63d604d3702c17fb138f7208");

        console.log(flight);

        let randomDepartureMonth = getRandom(2, 5);
        let randomDepartureDate = randomDate({
            year: 2023,
            month: 4,
            day: 21,
            hour: getRandom(1, 23),
        });

        // return res.send(randomDepartureDate);
        // let randomDepartureDate = new Date(flight.sourceTime);

        let currentTime = randomDepartureDate.getTime();
        let hour = getRandom(2, 12);
        let arrivalDate = new Date(currentTime + hour * 60 * 60 * 1000);

        flight = await Flight.create({
            name: "SpiceJet Airlines",
            sourceLoc: flight.sourceLoc,
            destinationLoc: flight.destinationLoc,
            sourceLocAirport: flight.sourceLocAirport,
            destinationLocAirport: flight.destinationLocAirport,
            sourceTime: randomDepartureDate,
            arrivalTime: arrivalDate,
        });
        return res.status(200).json({
            flight,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            message: "couldn;t create many  flights",
        });
    }
};
//
// exports.updateAllFlightData = async (req, res, next) => {
//     try {
//         const updatedData = await Flight.updateMany({});
//     } catch (err) {}
// };

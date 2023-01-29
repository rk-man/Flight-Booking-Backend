const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

const createAndSendToken = (res, statusCode, user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_CODE, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60,
    });

    user.password = undefined;

    return res.status(statusCode).json({
        status: "success",
        data: {
            user,
            token,
        },
    });
};

exports.registerUser = async (req, res, next) => {
    let user = null;
    try {
        // step 1 - create the user
        user = await User.create(req.body);

        // step 2 - create the token and send the user along with the token
        createAndSendToken(res, 200, user);
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err,
            message: "Couldn't create user",
        });
    }
};

exports.loginUser = async (req, res, next) => {
    let user = null;
    try {
        //getting the user object based on the username
        user = await User.findOne({ username: req.body.username }).select(
            "+password"
        );

        console.log(user);

        //checking if the user exist
        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "user not found with that username",
            });
        }

        //checking for password
        if (!(await user.comparePassword(req.body.password, user.password))) {
            return res.status(400).json({
                status: "failed",
                message: "The entered password is incorrect",
            });
        }

        createAndSendToken(res, 200, user);
    } catch (ex) {
        console.log(ex);
    }
};

exports.restrictTo = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                status: "fail",
                message: "Only admins can perform this action",
            });
        }
        next();
    };
};

exports.protect = async (req, res, next) => {
    let token = null;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // "Bearer sfsdghsfhdghsfvsjdgvbjfd" -> ["Bearer","sfsdghsfhdghsfvsjdgvbjfd"]
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "undefined") {
        return res.status(403).json({
            message: "You are not authorized",
        });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);

    let currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return res.status(400).json({
            message: "the user associated with this token no longer exists",
        });
    }

    req.user = currentUser;
    next();
};

exports.getMe = async (req, res, next) => {
    let user = req.user;

    if (user) {
        return res.status(200).json({
            user,
        });
    } else {
        return res.status(400).json({
            message: "Something went wrong",
        });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        let user = req.user;
        let updateUser = await User.findByIdAndUpdate(user._id, req.body, {
            new: true,
            runValidators: true,
        });

        return res.status(203).json({
            status: "success",
            user: updateUser,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            err: err,
            message: "Couldn't update user",
        });
    }
};

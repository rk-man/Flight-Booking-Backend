const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
dotenv.config({ path: path.join(__dirname, "/.env") });

const DB_CON_STRING = process.env.DB_CON_STRING.replace(
    "<password>",
    process.env.DB_PASS
);

mongoose.set("strictQuery", false);
mongoose.connect(DB_CON_STRING, () => {
    console.log("DB connected successfully");
});

const port = process.env.PORT || 5000;
const app = require("./app");

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});

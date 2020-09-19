// imports and Environment initialise
import express from "express";
import mongoose from "mongoose";
import data from "./data.js";
import tiktokVideo from "./dbModel.js";
import Stripe from "stripe";

// Stripe for amazon (stripe Secret Key)
const stripe = new Stripe("sk_test_51HSFjhCUcvvuS7GMLeagcgiWNGaObl5JKgeGU7oFQCDgCyYh4mCUcZkMvYAxfnc67biprt6GPzAboF7qT4vmrPhB00G2Co1Hu0");

const PORT = process.env.PORT || 1234;

// app initialise
const app = express();

// middle ware
app.use(express.json());
/*      this is not safe , this headers will allow all requestes without authetication */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "*");
    next();
})

// mongo db with mongoose connection
const connection_string = "mongodb+srv://yogesh:yogesh@yogeshgowda.xoqag.mongodb.net/tiktok-clone-db?retryWrites=true&w=majority"

mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, data) => {
    if (err) {
        console.log("\n\n\nData base connection error", err)
    } else {
        console.log("\n\n\nData connections ucessfull", data)
    }
});

// api endpoints
app.get("/", (req, res) => {
    console.log("server get working")
    res.status(200).json("This the Back End for Tick Tok  and Amazon  Please open the Front End via  links given in Portfolio or Git hub. Portfolio- https://yogesh-portfolio.netlify.app/   GitHub- https://github.com/YOGESH-C-GOWDA")
})

app.get("/v1/posts", (req, res) => {
    res.status(200).json(data)
})

app.get("/v2/posts", (req, res) => {
    tiktokVideo.find((err, doc) => {
        if (err) {
            console.log("\n\n\nError findong Documnet from the mongoDB ----->", err);
            res.status(500).json("\n\n\nError findong Documnet from the mongoDB ----->", err);
        } else {
            console.log("\n\n\n Found Documne tfrom the mongoDB ----->", doc);
            res.status(200).json(doc);

        }
    })
})

app.post("/v2/posts", (req, res) => {

    console.log("request body after passing through middle ware", req.body)

    const videoDoc = req.body;

    tiktokVideo.create(videoDoc, (err, data) => {
        if (err) {
            console.log("\n\n\ncreate err", err);
            res.status(500).json(err);
        } else {
            console.log("\n\n\ndocument created in data base is ", data);
            res.status(201).json(data)
        }
    })

})

// Start of Amazon


// - API routes
app.get("/api/v1/amazon", (request, response) => response.status(200).send("Yogesh Completed the amazon Clone on 15 Sep 2020"));

app.post("/api/v1/amazon/payments/create", async (request, response) => {
    try {
        const total = request.query.total;

        console.log("Payment Request Recievied in Indian paisee >>> ", total);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total, // subunits of the currency
            currency: "inr",
        });
        console.log("Part 2: Payment Request Recievied in Indian paisee  >>> ", total);
        // OK - Created
        response.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (e) {
        if (e.type === 'StripeCardError') {
            // Display error on client
            return response.send({ error: e.message });
        } else {
            // Something else happened
            return response.status(500).send({ error: e.type });
        }

    }
});

// End of amazon



// listen
app.listen(PORT, console.log(`server runnung at port ${PORT}`));
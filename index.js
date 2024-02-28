const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middlewares
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4zcowrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// middlewares
const logger = async (req, res, next) => {
    console.log('called:', req.host, req.originalUrl);
    next();
}

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log('token from middleware:', token);
    if (!token) {
        return res.status(403).send({ message: 'Unauthrized' });
    }
    jwt.verify(token, process.env.DB_SECRET, (err, decoded) => {
        // error
        if (err) {
            return res.status(403).send({ message: 'Unauthrized' })
        }
        // if token is valid then it will be decoded
        console.log('value in the token', decoded);
        req.user = decoded;
        next();
    })

}




async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const serviceCollection = client.db('CarDoctor').collection('services');
        const bookingCollection = client.db('CarDoctor').collection('checkout');


        //  require('crypto').randomBytes(64).toString('hex') To generate access token

        // auth related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.DB_SECRET, { expiresIn: '1h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                })
                .send({ success: true });
        })


        // services related api
        // services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray()
            res.send(result);
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })


        // bookings
        app.get('/bookings', verifyToken, async (req, res) => {
            // console.log('cookies', req.cookies.token)
            console.log('Valid token ', req.user);

            if(req.query.email !== req.user.email){
                return res.status(403).send({message: 'forbidden'})
            }

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })


        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            res.send(result);
        })

        app.patch(`/bookings/:id`, async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', async (req, res) => {
    res.send({ message: 'car doctor server is running' })
})

app.listen(port, () => {
    console.log(`server is running at port: ${port}`)
})
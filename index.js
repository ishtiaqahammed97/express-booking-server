const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors');
const app = express()
const port = 3000


const uri = `mongodb+srv://expressBooking:0T8qgcyTnoWiQ3Bn@cluster0.mugzz.mongodb.net/`;

// middlewares --> maddhom
app.use(cors());
app.use(express.json());

// body parser
app.use(express.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//     res.send('hello express');
// })

const booking = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

booking.connect()
    .then(() => {
        const ticketsCollection = booking.db("expressBooking").collection("tickets");
        const ordersCollection = booking.db("expressBooking").collection("orders");

        // console.log('Connected to MongoDB');

        // POST endpoint to add a ticket
        app.post('/addTicket', (req, res) => {
            const ticket = req.body;
            // console.log(ticket)

            // Check if the request body is empty or missing required fields
            // ! == false
            if (!ticket) {
                return res.status(400).json({ error: 'Data are not valid' });
            }
            // inserting data to database
            ticketsCollection.insertOne(ticket, (err) => {
                if (err) {
                    // console.log('Error')
                    return res.status(400).json({ message: 'Server error' });
                } else {
                    return res.status(201).json({ message: 'Ticket added successfully' });
                }
            })
                .catch(error => {
                    // console.error('Error inserting ticket:', error);
                    res.status(500).json({ error: 'An error occurred while adding the ticket' });
                });
        });

        // get all tickets
        app.get('/tickets', async (req, res) => {
            try {
                const tickets = await ticketsCollection.find({}).toArray();
                res.setHeader('Content-Type', 'application/json');
                res.json(tickets);
            } catch (error) {
                console.error('Error retrieving tickets:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // POST endpoint to a order
        app.post('/placeOrder', (req, res) => {
            const order = req.body;
            // console.log(order)

            // check if all data are available
            if (!order) {
                return res.status(400).json({ error: 'Request is not valid' });
            };

            ordersCollection.insertOne(order, (err) => {
                if (err) {
                    // console.log('Error')
                    return res.status(400).json({ message: 'Order is not valid' })
                } else {
                    // console.log('success')
                    return res.status(201).json({ message: 'Order successful' });
                }
            })
                .catch(error => {
                    // console.error('Error inserting ticket:', error);
                    res.status(500).json({ error: 'An error occurred while adding the ticket' });
                });
        })

        // get order/purchase history
        app.get('/purchase', async (req, res) => {
            try {
                const orders = await ordersCollection.find({}).toArray();
                res.setHeader('Content-Type', 'application/json');
                res.json(orders);
            } catch (error) {
                console.error('Error retrieving tickets:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });


    })


booking.close();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
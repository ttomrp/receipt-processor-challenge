import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import rules from './rules.js'

const app = express();
const port = 3000;

app.use(express.json());

let receiptMap = new Map();

/**
 * Starts server listening specified port
 */
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});


/**
 * GET - checks for a receipt matching the requested Id and responds with the points
 */
app.get('/receipts/:id/points', (request, response) => {
    const receiptId = request.params.id;
    const receipt = receiptMap.get(receiptId);
    if (receipt) {
        const points = receipt.points;
        response.status(200).json(
            {
                "points": points
            }
        );
    } else {
        response.status(404).send('No receipt found');
    }
});


/**
 * POST - takes a user receipt, calculates points, and posts receipt to the db responds with JSON of storage Id
 */
app.post('/receipts/process', (request, response) => {
    const payload = request.body;
    if (request.body) {
        const { retailer, purchaseDate, purchaseTime, total, items } = payload;

        let points = 0;
        try {
            points = calculatePoints(payload);
        } catch (error) {
            response.status(400).send('Error calculating points');
        }

        const newId = uuidv4();
        let receipt = {
            retailer,
            purchaseDate,
            purchaseTime,
            total,
            items,
            points
        };
        receiptMap.set(newId, receipt);

        response.status(201).json({ "Id" : newId});
    } else {
        response.status(400).send('Error saving receipt');
    }
});


/**
 * Helper function to calculate points when posting receipt to db
 * @param {*} receipt 
 * @returns 
 */
function calculatePoints(receipt) {
    let points = 0;
    points += rules.retailerRules(receipt.retailer);
    points += rules.totalsRules(receipt.total);
    points += rules.itemsRules(receipt.items);
    points += rules.dateTimeRules(receipt.purchaseDate, receipt.purchaseTime);
    
    return points;
}
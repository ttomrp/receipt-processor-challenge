/**
 * 1 point for every alphanumeric character in retailer name
 * @param {string} retailer 
 * @returns {int} points
 */
export function retailerRules(retailer) {
    let points = 0;
    for (let i = 0; i < retailer.length; i++) {
        if (retailer[i].match(/[a-z0-9]/i)) {
            points++;
        };
    };
    return points;
};

/**
 * 50 points if the total is a round dollar ammount with no cents
 * 25 points if the total is a multiple of 0.25 cents
 * @param {*} total 
 * @returns 
 */
export function totalsRules(total) {
    let points = 0
    if (total % 1 === 0) { //check if round dollar 
        points += 50;
    };
    
    if (total % 0.25 === 0) { //check if multiple of .25
        points += 25;
    };
    return points;
};

/**
 * 5 points for every two items on the receipt
 * If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned
 * @param {*} items 
 * @returns 
 */
export function itemsRules(items) {
    let points = 0
    points += Math.floor(items.length / 2) * 5; //add 5 points for every two items
    items.forEach(item => {
        if (item.shortDescription.trim().length % 3 === 0) { //check if short desc is multiple of 3
            points += Math.ceil(item.price * 0.2);
        };
    });
    return points;
};

/**
 * 6 points if the day in the purchase date is odd
 * 10 points if the time of purchase is after 2:00pm (14:00) and 4:00pm (16:00)
 * @param {*} purchaseDate 
 * @param {*} purchaseTime 
 * @returns 
 */
export function dateTimeRules(purchaseDate, purchaseTime) {
    const date = new Date(purchaseDate);
    const hour = parseInt(purchaseTime.split(':')[0]);
    let points = 0;
    if (date.getUTCDate() % 2 === 1) { //check if day is odd
        points += 6;
    };
  
    if (hour >= 14 && hour < 16) { //check if time is between 14:00 and 16:00
        points += 10;
    };
    return points;
};


export default { 
    retailerRules,
    totalsRules,
    itemsRules,
    dateTimeRules
};
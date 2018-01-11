/********** Import libs **********/
const express = require('express');
const app = express();
const api = express.Router();
const request = require('request');


/********** SETUP API ROUTES  **********/


const baseApiUrl = 'https://api.coinmarketcap.com/v1/ticker';


// Handle base route
api.get('/', function(req, res) {
    res.json( { message: 'Welcome to our API' });
});


// // Return top 1000 coin info
api.get('/all', function(req, res) {

    let url = `${baseApiUrl}/?limit=1000`;

    let numCoins = 0;
    let avg_1h_percent_change = 0;
    let avg_24h_percent_change = 0;
    let avg_7d_percent_change = 0;

    request.get (url, (error, response, body) => {

        // Hold basic response info
        let coins = JSON.parse(body);
        numCoins = coins.length;
        console.log(`RESults: ${numCoins}`);


        // Sum each coin's changes
        for (let coin of coins) {
            console.log(coin);

            let coin_1h = parseFloat(coin.percent_change_1h);
            let coin_24h = parseFloat(coin.percent_change_24h);
            let coin_7d = parseFloat(coin.percent_change_7d);

            // If the coin has required vars
            if (coin_1h && coin_24h && coin_7d) {

                avg_1h_percent_change += coin_1h;
                avg_24h_percent_change += coin_24h;
                avg_7d_percent_change += coin_7d;
                console.log(coin.symbol, coin_1h, coin_24h, coin_7d);
            }

            // Otherwise skip it
            else {
                console.log(coin.symbol, "NaN");
                numCoins--;
            }

        }

        // Take the average percent changes
        avg_1h_percent_change /= numCoins;
        avg_24h_percent_change /= numCoins;
        avg_7d_percent_change /= numCoins;

        //
        console.log(`numCoins: ${numCoins}`);
        console.log(`Avg 1h change: ${avg_1h_percent_change}`);
        console.log(`Avg 24h change: ${avg_24h_percent_change}`);
        console.log(`Avg 7d change: ${avg_7d_percent_change}`);

    });

    res.json(
        {
            message: 'Top 1000 coins',

        }
    );

});



 /******************** START SERVER ********************/

 // Move all 'router' routes under '/api'
 app.use('/api', api);


 // Statically serve the dist folder
 //app.use(express.static(path.join(__dirname + '/dist')));


 // This route needs to be last
 // This will serve the site and pass the path to the Angular app
 // app.get('*', function(req, res) {
 // 	//res.sendFile(path.join(__dirname + '/dist/index.html'));
 //    res.sendFile(path.join(__dirname + '/index.html'));
 // });


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Crypto Arbitrage Isolator Site server is running on port: ${port}`);
});

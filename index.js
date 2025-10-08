const crypto = require('crypto');
const axios = require('axios');

const SYMBOL = 'BTCUSDT';
const BUY_PRICE = 124586;
const SELL_PRICE = 125096;
const QUANTITY = '0.001';
const API_KEY = 'Y5KSuNp5oSKOIQl6bwR7UIZZ1twBlsQVy56H9j9EA3IVOmFLQmUM4qHivlxIJhTB';
const SECRET_KEY = 'Ljca9BoFopbSgaqCCXPqrgnYT3Hb8brPneUPSrjGpyWvbKyE6JrsLZk0O0P77yLX';

const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false;

function calcSMA(data) {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a,b) => a + b);
    return sum / data.length
}

async function start() {

    //comandos do robô
    
    const {data} = await axios.get(API_URL + '/api/v3/klines?limit=21&interval=15m&symbol=' + SYMBOL);
    const candle = data[data.length -1]
    const price = parseFloat(candle[4]);

    console.clear();
    console.log('Price: ' + price);

    const sma = calcSMA(data);
    //const sma13 = calcSMA(data.slice(8));//
    console.log('SMA: '+ sma);
    //console.log('SMA (13): '+ sma13); //
   // console.log('SMA (21): '+ sma21);//
    console.log('Is Opened? ' + isOpened);

    if (price <= (sma * 0.9) && isOpened === false){
        isOpened = true;
        newOrder(SYMBOL, QUANTITY, 'buy');
    }

    else if(price >= (sma * 1.1) && isOpened === true){
        newOrder(SYMBOL, QUANTITY, 'sell');
        isOpened = false;
    
    }

    else {
        console.log('aguardar');
    }

}

async function newOrder(symbol, quantity, side){
    const order = { symbol, quantity, side};
    order.type = "MARKET";
    order.timestamp = Date.now();

    const signature = crypto
    .createHmac('sha256',  SECRET_KEY)
    .update(new URLSearchParams(order).toString())
    .digest('hex');

    order.signature = signature;

    try{
        const {data} = await axios.post(
            API_URL + '/api/v3/order',
            new URLSearchParams(order).toString(),
            { headers: {'X-MBX-APIKEY': API_KEY}}
        )

        console.log(data);
    }
    catch(err){
        console.error(err.response.data);
    }

}

//comando para iniciar uma função de repetição a cada segundo//

setInterval(start, 3000);

start();
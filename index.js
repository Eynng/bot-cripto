const axios = require('axios');

const SYMBOL = 'BTCUSDT';
const BUY_PRICE = 124586;
const SELL_PRICE = 125096;

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

    if (price <= sma * 0.9 && isOpened === false){
        console.log('comprar');
        isOpened = true;
    }

    else if(price >= sma * 1.1 && isOpened === true){
        console.log('vender');
        isOpened = false;
    }

    else {
        console.log('aguardar');
    }

}

//comando para iniciar uma função de repetição a cada segundo//

setInterval(start, 3000);

start();
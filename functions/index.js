const functions = require("firebase-functions");
const {Telegraf} = require("telegraf");
const axios = require("axios");

let config = require("./env.json");

if (Object.keys(functions.config()).length) {
    config = functions.config();
}

const bot = new Telegraf(config.service.telegram_token);

bot.start((ctx) => {
    ctx.reply("Welcome!");
});

bot.on("text", (ctx) => {
    const query = ctx.update.message.text;
    axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${config.service.weather_api_token}&q=${query}&days=1`)
        .then((response) => {
            const apiResponse = response.data;
            ctx.reply(`Current temperature in ${apiResponse.location.name} is ${apiResponse.current.temp_c}℃. It feels like ${apiResponse.current.feelslike_c}℃.\nToday the minimum temperature will be ${apiResponse.forecast.forecastday[0].day.mintemp_c} ℃, the maximum - ${apiResponse.forecast.forecastday[0].day.maxtemp_c} ℃. ${apiResponse.forecast.forecastday[0].day.condition.text}.`);
        })
        .catch((error) => {
            ctx.reply('The city doesn\'t exist!');
        });
});

bot.launch();

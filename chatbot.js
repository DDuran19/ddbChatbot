const { MessengerClient, MessengerBot } = require('messaging-api-messenger');
const fs = require('fs');
require('dotenv').config();
const accessToken = process.env.ACCESS_TOKEN;
const appId = process.env.APP_ID;

// Load data from the JSON file
const data = JSON.parse(fs.readFileSync('data.json'));

const client = MessengerClient.connect({
    accessToken,
    appId
});

const bot = new MessengerBot({
  client,
});

bot.onEvent(async (ctx) => {
  if (ctx.event.isText) {
    const message = ctx.event.text;

    // Level 1 options
    if (!ctx.session.level) {
      if (data.questions.hasOwnProperty(message.toLowerCase())) {
        ctx.session.level = 1;
        const level1Options = data.questions[message.toLowerCase()][0];

        await ctx.sendText(`You selected ${message}. Now choose from Level 2 options:`);
        Object.keys(level1Options).forEach((option, index) => {
          const responseKey = level1Options[option];
          const response = data.responses[responseKey];
          const optionNumber = index + 1;
          ctx.sendText(`${optionNumber}. ${response}`);
        });
      } else {
        await ctx.sendText('I\'m sorry, I didn\'t understand that.');
      }
    }

    // Level 2 options
    else if (ctx.session.level === 1) {
      const level1Options = data.questions[message.toLowerCase()][0];
      const responseKey = level1Options[message.toLowerCase()];
      const response = data.responses[responseKey];

      if (response) {
        await ctx.sendText(`You selected ${message}. ${response}`);
        // Handle further logic or end the conversation if needed
      } else {
        await ctx.sendText('I\'m sorry, I didn\'t understand that.');
      }

      // Reset the level to allow the user to choose a new option
      ctx.session.level = undefined;
    }
  }
});

bot.start();

const { MessengerClient, MessengerBot } = require('messaging-api-messenger');
const fs = require('fs');

// Load data from the JSON file
const data = JSON.parse(fs.readFileSync('your_data.json'));

const client = MessengerClient.connect({
  accessToken: 'EAAOAVZCzYjDgBAHpdrckmfSHkY2EoDZCp3ammUQpnWZBL9s3GbunvfZBhaUGR37dAu8itHtGmeJXRmqRlUJZBe9eXU7YmkR4fNwXZBnxiiuZAl8WzP65plBzqAwpwipgfjOdJsaD0XYZBKc82AGd5xifR8KW9SwFS1jawbKOP7GfPlS4K41WOrXD1lkPSkLhC8z1dJAFOotqegZDZD',
  appId: '985540322692152',
  appSecret: 'YOUR_APP_SECRET',
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

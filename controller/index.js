class Controller {
    constructor() {
        this.telegram_module = require('node-telegram-bot-api');
        this.Bot = new this.telegram_module(process.env.TELEGRAM_TOKEN, { polling: true });
        this.models = require('../models');
        this.Watson = new (require('../models/watson'))();
        this.MongoDB = new (require('../models/mongo'))();
    }

    // parametro com opções de input do web_telegram
    async onMessage(message = this.models.MessageOptions) {
        try {
            if (Object.keys(message).indexOf("text") < 0)
                return false;

            var context = await this.MongoDB.findContext({
                chat_id: message.chat.id
            });
            var watsonMessage = await this.Watson.sendMessage(message.text, context);
            await this.MongoDB.saveContext({
                chat_id: message.chat.id,
                context: watsonMessage.context
            });

            this.Bot.sendMessage(message.chat.id, watsonMessage.text);
        } catch (error) {
        }
    }

    async __listen() {
        this.Bot.on('message', (message) => {
            this.onMessage(message);
        });
    }
}

module.exports = Controller;
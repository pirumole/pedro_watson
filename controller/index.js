class Controller {
    constructor() {
        this.telegram_module = require('node-telegram-bot-api');
        this.Bot = new this.telegram_module(process.env.TELEGRAM_TOKEN, { polling: true });
        this.models = require('../models');
        this.Watson = require('../models/watson');
        this.MongoDB = require('../models/mongodb');
    }

    // parametro com opções de input do web_telegram
    async onMessage(message = this.models.MessageOptions) {
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
    }

    async __listen() {
        this.Bot.on('message', this.onMessage);
    }
}

module.exports = Controller;
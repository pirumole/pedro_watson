class Mongo {
  constructor() {
    // obtendo conexão com servidor e a database
    this.client = this.getClient();
    this.models = require('./index');
  }

  // retorna o Cliente MongoDB
  getClient() {
    const MongoClient = require('mongodb').MongoClient;
    return new MongoClient(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async connection() {
    if (!this.client.isConnected()) {
      await this.client.connect();
      this.collection = await this.connectDB();
    }
    return true;
  }

  // conecta com a database e a collection.
  async connectDB() {
    return this.client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLL);
  }

  // busca o contexto através da intenficação do telegram
  async findContext(options = this.models.FindOptions) {
    await this.connection();
    try {
      const data = await this.collection.findOne({ chat_id: options.chat_id });

      return data;
    } catch (error) {
      return null;
    }
  }

  // salva o contexto utilizando o identificador do telegram
  async saveContext(options = this.models.SaveOptions) {
    await this.connection();
    try {
      const data = await this.findContext({ chat_id: options.chat_id });

      if (!data) {
        await (await this.collection).insertOne({
          chat_id: options.chat_id,
          context: options.context,
          last_message: new Date()
        });
        return true;
      } else {
        await this.collection.updateOne({
          chat_id: options.chat_id
        }, {
          $set: { context: options.context, last_message: new Date() }
        });
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}

module.exports = Mongo;
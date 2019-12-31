class MongoCLient {
  constructor() {
    this.client = this.getClient();
    this.collection = null;
    this.models = require('./index');
  }

  getClient() {
    const MongoClient = require('mongodb').MongoClient;
    return new MongoClient(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async connectDB() {
    return this.client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLL);
  }

  async findContext(options = this.models.FindOptions) {
    try {
      await this.client.connect();

      this.collection = await this.connectDB();
      const data = await this.collection.findOne(options.chat_id);

      await this.client.close();
      return data;
    } catch (error) {
      await this.client.close();
      return null;
    }
  }

  async saveContext(options = this.models.SaveOptions) {
    try {
      await this.client.connect();

      await this.collection.updateOne({ chat_id: options.chat_id }, { $set: { context: options.context } });

      await this.client.close();
      return true;
    } catch (error) {
      await this.client.close();
      return false;
    }
  }
}

module.exports = new MongoCLient;
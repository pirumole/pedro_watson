class Model {
  constructor() {
    this.message_id = Number;
    this.from = {
      id: Number,
      is_bot: Boolean,
      first_name: String,
      last_name: String,
      language_code: String
    };
    this.chat = {
      id: Number,
      first_name: String,
      last_name: String,
      type: String
    };
    this.date = Number;
    this.text = String;
    this.entities = [{
      offset: Number,
      length: Number,
      type: String
    }];
    this.photo = [
      {
        file_id: String,
        file_unique_id: String,
        file_size: Number,
        width: Number,
        height: Number
      }
    ];
    this.voice = {
      duration: Number,
      mime_type: String,
      file_id: String,
      file_unique_id: String,
      file_size: Number
    }
    this.video = {
      duration: Number,
      width: Number,
      height: Number,
      mime_type: String,
      thumb: {
        file_id: String,
        file_unique_id: String,
        file_size: Number,
        width: Number,
        height: Number
      },
      file_id: String,
      file_unique_id: String,
      file_size: Number
    }
  }
}

module.exports = new Model;
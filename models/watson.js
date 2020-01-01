class Watson {

  /**
   * construtor da classe
   * 
   * criando estancia da classe da IBM.
   */
  constructor() {
    this.watsonModule = require('ibm-watson/assistant/v1');
    this.IamAuthenticator = require('ibm-watson/auth').IamAuthenticator;

    this.Assistant = new this.watsonModule({
      url: process.env.ASSISTANT_URL,
      version: process.env.ASSISTANT_VERSION,
      authenticator: new this.IamAuthenticator({
        apikey: process.env.ASSISTANT_PASS
      }),
      headers: {
        'X-Watson-Learning-Opt-Out': 'true'
      }
    });
    this.section = null;
  }

  async sendMessage(message = "", context = {}) {
    var toMessage = {
      workspaceId: process.env.ASSISTANT_WORKSPACE,
      input: {
        text: message
      }
    };

    if (context && Object.keys(context).length)
      toMessage.context = context;

    try {
      var resWatson = await this.Assistant.message(toMessage);

      return {
        text: resWatson.result.output.text[0],
        context: resWatson.result.context
      };
    } catch (error) {
      throw "error na resposta do watson";
    }
  }
}

module.exports = Watson;
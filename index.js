'use strict';

const Alexa = require('ask-sdk');
let http = require('http');

function getRecommendation(bookTitle, cb) {
  bookTitle = encodeURIComponent(bookTitle);
  const path = `/api/similar?q=${bookTitle}&type=books&k=${process.env.TASTE_DIVE_KEY}`
  let options = {
    host: 'tastedive.com',
    path,
    method: 'GET'
  }

  let req = http.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";

        res.on('data', chunk => {
            responseString = responseString + chunk;
        });

        res.on('end', () => {
            cb(responseString);
        });

    });
    req.end();
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';
return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const GetSimilarBookHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'GetSimilarBookIntent';
  },
  handle(handlerInput) {
      const book = handlerInput.requestEnvelope.request.intent.slots.book.value
      const bookTitle = encodeURIComponent(book);

      this.response.speak(book);
      this.response.cardRenderer('Book', book);
      this.emit(':responseReady');
  }
}

 const HelloWorldIntentHandler = {
     canHandle(handlerInput) {
         return handlerInput.requestEnvelope.request.type === 'IntentRequest'
             && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
     },
     handle(handlerInput) {
         const speechText = 'Hello World!';
 return handlerInput.responseBuilder
             .speak(speechText)
             .withSimpleCard('Hello World', speechText)
             .getResponse();
     }
 };

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';
return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};

//###########################

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder.addRequestHandlers(LaunchRequestHandler,
                         HelloWorldIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         GetSimilarBookHandler,
                         SessionEndedRequestHandler)
     .addErrorHandlers(ErrorHandler)
     .lambda();

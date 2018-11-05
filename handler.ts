import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { Translate } from 'aws-sdk';
import { TranslateTextRequest } from 'aws-sdk/clients/translate';

export const translate: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const queryParameters = event.queryStringParameters || {};
  const text = queryParameters.text;
  const fromLanguageCode = queryParameters.fromLanguageCode;
  const toLanguageCode = queryParameters.toLanguageCode;
  if (!text || !fromLanguageCode || !toLanguageCode) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'text, fromLanguageCode, and toLanguageCode are all required',
      }, null, 2),
    };
    cb(null, response);
    return;
  }
  const params:TranslateTextRequest = {
    Text: text,
    SourceLanguageCode: fromLanguageCode,
    TargetLanguageCode: toLanguageCode,
  };
  const translate = new Translate();
  translate.translateText(params, (err, data) => {
    if (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: `Something went wrong: ${err}`,
        }, null, 2),
      };
      cb(null, response);
      return; 
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        textToTranslate: text,
        fromLanguageCode: fromLanguageCode,
        toLanguageCode: toLanguageCode,
        translation: data.TranslatedText,
      }, null, 2),
    };

    cb(null, response);
  });
}

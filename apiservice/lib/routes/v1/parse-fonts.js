const express = require('express');
const Ajv = require('ajv');
const schema = require('./parse-fonts-shema.json');
const config = require('../../services/config.js');
const GeckoDriver = require('../../services/geckodriver.js');

const router = module.exports = express.Router();
const ajv = Ajv({
  allErrors: true,
  removeAdditional: 'all'
});
ajv.addSchema(schema, 'parse-fonts');

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  const errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  });

  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
const validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.query);
    if (!valid) {
      const err = new Error('Request failed.');
      err.response = errorResponse(ajv.errors);
      err.statusCode = 404;
      err.json = true;

      return next(err);
    }

    next();
  }
};

router.get('/parseFonts', validateSchema('parse-fonts'), async (req, res, next) => {
  try {
    const url = decodeURIComponent(req.query.url);
    const mode = req.query.mode;

    if (!url) {
      const err = new Error('URL is missing.');
      err.statusCode = 404;
      err.response = 'Request failed.';

      throw err;
    }

    const geckoService = new GeckoDriver({
      baseUrl: config.get('GECKO_DRIVER_BASEURL')
    });

    await geckoService.startSession();
    console.log('Session response:', geckoService.session);

    let thrownError;
    try {
      await geckoService.navigate(url);
      const response = await geckoService.processNodes(mode);
      if (mode) {
        res.setHeader('X-Traversal-Mode', mode);
      }

      res.json(response.value);

    } catch (err) {
      thrownError = err;
    } finally {
      await geckoService.endSession();
      if (thrownError) {
        next(thrownError);
      }
    }
  } catch (err) {
    next(err);
  }
});

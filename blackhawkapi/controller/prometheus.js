let Validator = require('jsonschema').Validator;
require('dotenv').config();

let timeSchema = {
    "properties": {
    "epoch": {
    "description": "The current server time, in epoch seconds, at time of processing the request.",
    "type": "number"
    }
    },
    "required": ["epoch"],
    "type": "object"
}
   

module.exports.getTime = async (req, res) => {
  try {
    const now = new Date() ; 
    const utcMilllisecondsSinceEpoch = now.getTime();
    const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000);

    let time = {
        epoch: utcSecondsSinceEpoch
    }
    let timeSchemaValidator = new Validator();
    console.log(timeSchemaValidator.validate(time, timeSchema));
    res.send({
        data: time,
        message: "SUCCESS",
        status: "OK"
    })
  } catch (error) {
    return Services._validationError(res, error, "Error in fetch time");
  }
};

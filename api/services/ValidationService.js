var validator = require('sails-validation-messages');

module.exports = {
    jsonResolveError: function (err, Model, res) {
        var response = {
            response : {
                message: 'Validation error has occured',
            }
        };
        if (err.invalidAttributes) {
            err.invalidAttributes = validator(Model, err.invalidAttributes);
            response.response.message = 'Validation error has occured';
            response.response.errors = err.invalidAttributes;
            return res.send(400, response);
        } else {
            var myErr = JSON.parse(JSON.stringify(err));
            if ((myErr.status == 500) && (myErr.raw.code == 11000)){
                response.response.error = "The record has already been registered";
                return res.send(400, response);
            }
            return res.negotiate(err);
        }
    },
    uniquenessError: function (fieldName, Model, res) {
        var response = {
            "response": {
                "message": "Validation error has occured",
                "errors": {}
            }
        };
        var message = Model.validationMessages[fieldName].unique;
        response.response.errors[fieldName] = [{
            "rule": "unique",
            "message": message
        }];
        return res.json(response, 400);
    }
};

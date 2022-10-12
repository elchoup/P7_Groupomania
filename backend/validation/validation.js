const joi = require('joi')

function userValidation(user) {

    const userValidationSchema = joi.object({
        pseudo: joi.string()
                    .min(3)
                    .max(15)
                    .required()
                   ,
        email: joi.string()
                   .email()
                   .required()
                   ,
        
        password: joi.string()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                    .required()
                                     
    })

    return userValidationSchema.validate(user)

}

module.exports = userValidation;
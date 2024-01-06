// Basic validation using Joi and phone Package 

// Requied Package {JOI} {Phone}

const Joi = require("joi");

const {phone} = require('phone');

const isValidEmail = (email)=>{
     
    const { error , value }  =  Joi.string().email().required().validate(email)

    if(error ) { return false }
     
    if(value) { return true }
}

const isValidPassword = (password)=>{

    const pattern    =  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/
    
    const { error , value }  =  Joi.string().regex(pattern).required().validate(password)

    if(error) { return false }
    
    if(value) { return true }
}

const isValidName = (name)=>{

    const pattern    =  /^[a-zA-Z]+[a-zA-Z]+$/
    
    const { error , value }  =  Joi.string().regex(pattern).min(3).max(20).required().validate(name)

    if(error) { return false }
     
    if(value) { return true }
}

const phoneNumberValidation = (countryCode,phoneNumber)=>{

    const number =  countryCode + phoneNumber

    const isValid  =  phone(number).isValid

    if(isValid) { return true }
     
    return false
   
}


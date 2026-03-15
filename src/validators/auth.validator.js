import {body,validationResult} from 'express-validator'


export function validate(req,res,next){
        const errors=validationResult(req)
        if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
        }

        next()
}


export const registerValidator=[
    body('username')
    .trim()
    .notEmpty().withMessage("UserName is Required")
    .isLength({min:3,max:30}).withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("UserName can only contins letters,numbers, and underscores"),

    body('email')
    .trim()
    .notEmpty().withMessage("Email Is Required")
    .isEmail().withMessage("please provide a valid Email"),

    body('password')
    .notEmpty().withMessage("Password is Required")
    .isLength({min:6,max:20}).withMessage("Password Must be atleast 6 characters"),

    validate
]

export const loginValidator=[
    body('email')
    .trim()
    .isEmpty().withMessage("Email is Required")
    .isEmail().withMessage("Please provide valid Email"),

    body('password')
    .notEmpty().withMessage("Password is Required"),

    validate

]
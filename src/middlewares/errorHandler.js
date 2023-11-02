import { EError } from "../enums/EError.js"

export const errorHandler = (error, req,res,next) => {
    switch (error.code){
        case EError.DATABASE_ERROR:
            res.json ({status:"error", message:error.cause, errorMessage:error.message});
            break;
            case EError.INVALID_PARAMS:
            res.json({status:"error",message:error.cause, errorMessage:error.message});
            break;
            case EError.INVALID_JSON:
            res.json({status:"error",message:error.cause});
            break;
      
        default:
            break;

    }
}
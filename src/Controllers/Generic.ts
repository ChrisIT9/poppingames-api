import { NextFunction, Request, Response } from 'express';

export const validStringIfExists = (param: string | undefined) => {
    if (param === undefined || (param !== undefined && param !== ""))
        return true;

    throw "Parametro non valido!";
}

export const validNumberIfExists = (param: string | undefined) => {
    if (param !== undefined && isNaN(parseInt(param)))
        throw "Il valore non è valido!";
    
    return true;    
}
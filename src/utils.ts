import express from 'express'

export function wrapAsync(fn: Function) {
    return function(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        fn(req, res, next).catch(next)
    }
}

import { config } from '../config/config.js'
import { createLogger, format, transports } from 'winston';

const customLevelsOptions = {
    levels:{
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'blue',
        http: 'green',
        info: 'cyan',
        warning: 'yellow',
        error: 'red',
        fatal: 'magenta'
    }
}

const productionLogger = createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize({ colors: customLevelsOptions.colors }),
                format.simple()
            )
        }),
        new transports.File({
            filename: './errors.log', 
            level: 'error',
            format: format.simple()
        })
    ]
})

const developmentLogger = createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize({ colors: customLevelsOptions.colors }),
                format.simple()
            )
        })
    ]
})


export const typeLogger = (req, res, next) => {
    if(config.nodeEnv === 'production') req.logger = productionLogger;
    else req.logger = developmentLogger
    next()
}

export const errorLoger = createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new transports.Console({
            level: 'error',
            format: format.combine(
                format.colorize({ colors: customLevelsOptions.colors }),
                format.simple()
            )
        })
    ]
})

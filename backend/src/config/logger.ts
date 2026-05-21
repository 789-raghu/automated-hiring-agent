import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.cli(),
            ),
        }),
        new winston.transports.File({
            filename: "src/logs/app.log",
            options: { flags: "w" },
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
            ),
        }),
    ],
});

export default logger;

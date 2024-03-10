import 'dotenv/config'
import DB_CONNECT from "./db/index.js";
import { app } from './app.js';

DB_CONNECT()
    .then(() => {
        app.on('error', (err) => {
            console.log("Error Connecting to Express APP". err)
        })
        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server is running at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("ERROR Connecting To DB", err)
        process.exit(1)
    })

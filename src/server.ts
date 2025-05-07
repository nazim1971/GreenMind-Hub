import { Server } from "http";
import app from "./app";
import config from "./app/config";

const port = process.env.PORT|| config.port;

async function main() {
    const server: Server = app.listen(port, ()=>{
        console.log("Server is running on port", port);
    })
}

main();
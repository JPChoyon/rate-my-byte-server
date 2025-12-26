import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;
const main = async () => {
  server = app.listen(config.port, () => {
    console.log("Server is running on port :", config.port);
  });
};
main();

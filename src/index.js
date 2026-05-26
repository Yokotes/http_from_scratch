import http from "node:http";
import { FileLoader } from "./fileLoader.js";
import { Config } from "./configLoader.js";
import { Server } from "./server.js";

const DEFAULT_PORT = 3000;

Config.loadConfig();

const port = Config.port || DEFAULT_PORT;
const server = new Server(FileLoader, Config);

server.run(port, () => {
  console.log(`Running at ${port} port...`);
});

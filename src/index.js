import http from "node:http";
import { FileLoader } from "./fileLoader.js";
import { Config } from "./configLoader.js";
import { Server } from "./server.js";

Config.loadConfig();

const server = new Server(FileLoader, Config);

server.run(Config.port, () => {
  console.log(`Running at ${Config.port} port...`);
});

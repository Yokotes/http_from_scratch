import http from "node:http";
import { loadPublicFile } from "./fileLoader.js";

const FILE_REGEX = /\/.+\.(js)/;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/" && method === "GET") {
    const indexFile = loadPublicFile();

    res.writeHead(200, { "content-type": "text/html" });
    res.end(indexFile);

    return;
  }

  if (FILE_REGEX.test(url) && method === "GET") {
    const file = loadPublicFile(url);

    //  Найти другой способ
    const ext = FILE_REGEX.exec(url)[1];

    if (file) {
      // Надо бы создать справочник с расширениями и контент тайпами
      res.writeHead(200, { "content-type": "application/javascript" });
      res.end(file);

      return;
    }
  }

  res.writeHead(404);
  res.end();
});

server.listen(3000, "localhost", () => {
  console.log("Listening...");
});

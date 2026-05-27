import http from "node:http";

const FILE_REGEX = /\/.+\.(js|html)/;
const FILE_EXTENSION_MIME_TYPE = {
  js: "application/javascript",
  html: "text/html",
};

export class Server {
  _fileLoader;
  _config;
  _server;

  constructor(fileLoader, config) {
    this._config = config;
    this._fileLoader = fileLoader;

    this._server = http.createServer((req, res) => {
      const { url, method } = req;

      if (method !== "GET") {
        res.writeHead(400);
        res.end();
        return;
      }

      // Когда идет запрос на файл
      if (FILE_REGEX.test(url)) {
        const file = this._fileLoader.loadPublicFile(url);

        if (file) {
          const ext = FILE_REGEX.exec(url)[1];
          const mimeType =
            ext in FILE_EXTENSION_MIME_TYPE
              ? FILE_EXTENSION_MIME_TYPE[ext]
              : "text/plain";

          res.writeHead(200, { "content-type": mimeType });
          res.end(file);

          return;
        }
      }

      // Роуты
      const route = this._config.findRoute(url);
      if (route) {
        const file = this._fileLoader.loadPublicFile(route.filePath);

        if (file) {
          res.writeHead(200, { "content-type": FILE_EXTENSION_MIME_TYPE.html });
          res.end(file);

          return;
        }
      }

      res.writeHead(404);
      res.end();
    });
  }

  run(port, cb = () => {}) {
    this._server.listen(port, "localhost", () => {
      cb();
    });
  }
}

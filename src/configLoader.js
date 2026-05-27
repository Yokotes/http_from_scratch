import fs from "fs";

class Route {
  path;
  filePath;
  children;

  constructor(path, filePath, children = []) {
    this.path = path;
    this.filePath = filePath;
    this.children = children;
  }
}

const parseRoutes = (rawRoute) => {
  if (!rawRoute) return;
  if (!rawRoute.path && !rawRoute.filePath) return;

  const { path, filePath, children = [] } = rawRoute;

  if (path.split("/").length > 2)
    throw Error(`Invalid 'path' field in '${path}' route`);

  const parsedChildren = children
    .map((child) => parseRoutes(child))
    .filter((child) => !!child);

  return new Route(path, filePath, parsedChildren);
};

export class Config {
  static port = 3000;
  static route;

  static loadConfig() {
    let configFile;
    try {
      configFile = fs.readFileSync("./serverConf.json");

      if (!configFile) throw Error("Config not found");
    } catch (err) {
      console.error("Error while loading config", err);
    }

    let parsedConfig;
    try {
      parsedConfig = JSON.parse(configFile);
    } catch (err) {
      console.log("Error while parsing config", err);
    }

    if (!parsedConfig.route)
      throw Error("Not valid config, 'route' field required!");

    this.port = parsedConfig.port ?? this.port;
    this.route = parseRoutes(parsedConfig.route);
  }

  static findRoute(url) {
    if (!url || !this.route) return;
    if (url === "/") return this.route;

    return findRouteRecursive(url, this.route);
  }
}

const findRouteRecursive = (url, route) => {
  if (!url || !route) return;

  const urlArr = url.slice(1).split("/");
  const firstURL = "/" + urlArr.shift();
  const found = route.children.find((child) => child.path === firstURL);

  if (found && urlArr.length === 0) return found;
  if (found) return findRouteRecursive("/" + urlArr.join("/"), found);

  return;
};

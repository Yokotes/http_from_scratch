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

  const { path, filePath, children } = rawRoute;
  let parsedChildren = [];

  if (children) {
    for (const index in children) {
      const childRoute = parseRoutes(children[index]);

      if (childRoute) parsedChildren.push(childRoute);
    }
  }

  return new Route(path, filePath, parsedChildren);
};

export class Config {
  static port = 3000;
  static route;

  static loadConfig() {
    let configFile;
    try {
      configFile = fs.readFileSync("./serverConf.json");

      if (!configFile) throw new Error("Config not found");
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
      throw new Error("Not valid config, 'routes' field required!");

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
  let foundRoute;

  for (const index in route.children) {
    if (route.children[index].path === firstURL) {
      foundRoute = route.children[index];
      break;
    }
  }

  if (foundRoute && urlArr.length === 0) return foundRoute;
  if (foundRoute) return findRouteRecursive("/" + urlArr.join("/"), foundRoute);

  return;
};

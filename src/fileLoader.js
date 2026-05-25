import fs from "fs";
import path from "path";

export const loadPublicFile = (filePath = "/index.html") => {
  try {
    const file = fs.readFileSync(
      path.resolve("public", ...filePath.split("/").slice(1)),
    );
    return file.toLocaleString();
  } catch (err) {
    console.error(err);

    return false;
  }
};

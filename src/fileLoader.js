import fs from "fs";
import path from "path";

export class FileLoader {
  static loadPublicFile(filePath) {
    if (!filePath) throw Error("File path is undefined");

    // TODO: Решение такое себе... Подумать над иным.
    const filePathWithLeadingSlash =
      filePath[0] === "/" ? filePath : "/" + filePath;

    try {
      const file = fs.readFileSync(
        path.resolve("public", ...filePathWithLeadingSlash.split("/").slice(1)),
      );
      return file.toLocaleString();
    } catch (err) {
      console.error("Error while reading file", err);

      return false;
    }
  }
}

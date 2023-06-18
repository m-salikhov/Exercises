import { homedir } from "os";
import { join, relative, resolve } from "path";
import { constants, promises } from "fs";
import { printError } from "../service/log.service.js";

const filePath = join(homedir(), "weather-data.json");

const isExist = async () => {
  const res = await promises
    .access(filePath)
    .then(() => true)
    .catch(() => false);
  return res;
};

const saveProperty = async (key: string, value: string) => {
  let data: { [key: string]: string } = {};

  if (await isExist()) {
    const buffer = await promises.readFile(filePath);
    data = JSON.parse(buffer.toString());
  }
  data[key] = value;
  await promises.writeFile(filePath, JSON.stringify(data));
};

const getValue = async (key: string) => {
  if (isExist) {
    const buffer = await promises.readFile(filePath);
    const data: { [key: string]: string } = JSON.parse(buffer.toString());
    const value = data[key];
    if (value) return value;
  }
  printError(`${key} не задан`);
};

export { saveProperty, getValue };

#!/usr/bin/env node
import getArgs from "./helpers/args.js";
import { saveProperty, getValue } from "./helpers/storage.js";
import { getWeather } from "./service/api.service.js";
import { printError, printHelp, printSuccess } from "./service/log.service.js";

import * as dotenv from "dotenv";
dotenv.config();

const saveToken = async (token: string) => {
  if (typeof token !== "string") {
    printError("Токен не передан");
    return;
  }

  try {
    await saveProperty("token", token);
    printSuccess("Токен сохранён");
  } catch (error) {
    printError(error.message);
  }
};
const saveCity = async (city: string) => {
  try {
    await saveProperty("city", city);
    printSuccess("Город сохранён");
  } catch (error) {
    printError(error.message);
  }
};
const getForcast = async () => {
  try {
    const city = await getValue("city");
    const weather = await getWeather(city);
    console.log(weather);
  } catch (error) {
    if (error.response?.status === 404) {
      printError("Неверно указан город");
    } else if (error.response?.status === 401) {
      printError("Неверно задан токен");
    } else {
      console.log("nya");
      printError(error.message);
    }
  }
};

const main = async () => {
  const args = getArgs();
  if (args.s) {
    await saveCity(args.s);
  }
  if (args.h) {
    printHelp();
  }
  if (args.t) {
    await saveToken(args.t);
  }

  getForcast();
};

main();

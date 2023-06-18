import https from "https";
import { getValue } from "../helpers/storage.js";
import axios from "axios";

const getWeather = async (city: string) => {
  const token = await getValue("token");
  const url = "https://api.openweathermap.org/data/2.5/weather";
  // url.searchParams.append("q", city);
  // url.searchParams.append("appid", token);
  // url.searchParams.append("lang", "ru");
  // url.searchParams.append("units", "metric");

  // https.get(url, (responce) => {
  //   let res: any;

  //   responce.on("data", (chunk) => {
  //     // res += chunk;
  //     res = JSON.parse(chunk);
  //   });

  //   responce.on("end", () => {
  //     console.log("res", res);
  //   });
  // });

  const { data } = await axios.get(url, {
    params: {
      q: city,
      appid: token,
      lang: "ru",
      units: "metric",
    },
  });

  return data;
};

export { getWeather };

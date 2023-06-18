import chalk from "chalk";

const printError = (error: string) => {
  console.log(`${chalk.bgRed(" Error ")} ${error}`);
};

const printSuccess = (message: string) => {
  console.log(`${chalk.bgGreen(" Success ")} ${message}`);
};

const printHelp = () => {
  console.log(
    `${chalk.bgBlueBright(" Help ")}

Без параметров -  вывод погоды
${chalk.bold("-s [CITY]")} - установить город
${chalk.bold("-h")} - вызвать помощь
${chalk.bold("-t [API_KEY]")} - установить токен
    `
  );
};

export { printError, printSuccess, printHelp };

const isFlag = (arg: string | undefined) => {
  if (typeof arg === "string") return /^\-/.test(arg);
  return false;
};

const getArgs = () => {
  const [, , ...rest] = process.argv;
  const res: { [key: string]: string } = {};

  rest.forEach((v, i, arr) => {
    if (isFlag(v) && !isFlag(arr[i + 1]) && arr[i + 1]) {
      res[v.substring(1)] = arr[i + 1];
    }
  });
  return res;
};
export default getArgs;

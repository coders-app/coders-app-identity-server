import fs from "fs";

/* We can't use Node's import assertions to load JSON because ts-jest won't understand them
/* This is a workaround from https://stackoverflow.com/a/73747606/574218 */
/* It must be removed when Node's import assertions are stable */
export const loadJson = <T>(path: string) => {
  const file = fs.readFileSync(path).toString();
  const data = JSON.parse(file) as T;
  return data;
};

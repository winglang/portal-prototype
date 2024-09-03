import { readdirSync, readFileSync } from "fs";

export function listAvailableComponents() {
  const output: string[] = [];

  // regular expression to match JavaScript symbol:
  const symbol = /[_$A-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/;



  for (const file of readdirSync("components/ui")) {
    const code = readFileSync(`components/ui/${file}`, "utf-8");

    
    const start = code.indexOf("export {");
    if (start === -1) {
      continue;
    }

    const end = code.indexOf("}", start);
    const line = code.substring(start, end + 1);

    const components = line.match(new RegExp(symbol.source, "g")) || [];
    for (const component of components) {
      output.push(`import { ${component} } from "@/components/ui/${file.replace(".tsx", "")}";`);
    }
  }


  return output;
}


import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

export async function renderApiGroups() {
  const components = join(__dirname, '..', 'components');
  const views = join(components, 'views');
  const apiGroups = (await glob(join(views, '**', '*.metadata.json'), { absolute: true })).map(file => JSON.parse(readFileSync(file, { encoding: "utf-8" })));
  writeFileSync(join(components, 'api-groups.json'), JSON.stringify(apiGroups, null, 2));
}

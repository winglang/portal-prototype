import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export function renderApiGroups() {
  const apiGroups = [];
  const components = join(__dirname, '..', 'components');
  const views = join(components, 'views');

  for (const group of readdirSync(views)) {
    for (const version of readdirSync(join(views, group))) {
      for (const resource of readdirSync(join(views, group, version))) {
        const filepath = join(views, group, version, resource);

        if (!filepath.endsWith(".metadata.json")) {
          continue;
        }

        const metadata = JSON.parse(readFileSync(filepath, { encoding: "utf-8" }));
        apiGroups.push(metadata);
      }
    }
  }

  writeFileSync(join(components, 'api-groups.json'), JSON.stringify(apiGroups, null, 2));
}


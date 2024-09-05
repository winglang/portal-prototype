import * as k8s from '@kubernetes/client-node';
import {mkdirSync, writeFileSync} from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';
import { renderApiGroups } from './render-api-groups';
import { prompt } from './prompt';

async function renderResourceUi(resourceType: string) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
  const resource = await k8sApi.getClusterCustomObject('apiextensions.k8s.io', 'v1', 'customresourcedefinitions', resourceType);

  const crd: k8s.V1CustomResourceDefinition = resource.body as k8s.V1CustomResourceDefinition;

  const o = new OpenAI();

  console.log(`${resourceType}: Generating UI...`);

  const response = await o.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: `Schema: ${JSON.stringify(crd.spec.versions[0].schema)}`,
      },
    ]
  });

  let code = response.choices[0].message.content!;

  // check if the output is within backticks, and if so, remove them
  const start = code.indexOf("```typescript");
  const end = code.indexOf("```", start + 1);
  if (start !== -1 && end !== -1) {
    code = code.slice(start + 13, end);
  }

  const group = crd.spec.group;
  const version = crd.spec.versions[0].name;
  const plural = crd.spec.names.plural;
  const outputdir = `components/views/${group}/${version}`;

  mkdirSync(outputdir, { recursive: true });
  writeFileSync(join(outputdir, `${plural}.tsx`), code);


  // ask ai to come up with a nice icon for the resource out of the lucide icons
  console.log(`${resourceType}: Generating icon...`);
  const iconResponse = await o.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 100,
    messages: [
      {   
        role: 'system',
        content: `
        I will provide you with a Kubernetes resource name, and I need you to suggest an icon from the lucide icons that represents the resource.
        Return the icon name in plain text.
        `,
      },
      {
        role: 'user',
        content: `Resource: ${plural}`,
      }
    ]
  });

  const icon = iconResponse.choices[0].message.content!.trim();

  console.log(`${resourceType}: Writing metadata`);
  writeFileSync(join(outputdir, `${plural}.metadata.json`), JSON.stringify({
    group,
    plural,
    version,
    icon,
  }, null, 2));

  console.log(`${resourceType}: Done!`);
}

async function main() {
  if (!process.argv[2]) {
    console.error('Usage: ts-node discover.mts <resourceType>');
    process.exit(1);
  }
    
  for (const resource of process.argv.slice(2)) {
    await renderResourceUi(resource);
  }
  
  renderApiGroups();
}

main().catch(console.error);

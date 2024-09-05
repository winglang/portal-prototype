#!/usr/bin/env npx tsx
import {mkdirSync, writeFileSync} from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';
import { renderApiGroups } from './render-api-groups';
import { prompt } from './prompt';
import { kubernetesRequest } from "../lib/k8s";
import { extractSchema } from './extract-schema';
import { getNames } from './get-names';
import { CompletionOutput } from './prompt-types';

async function addResource(model: any, resourceType: string) {

  const schema = await extractSchema(model, resourceType);
  const groupVersionKind = schema.definitions[resourceType]["x-kubernetes-group-version-kind"][0];

  console.log(`${resourceType}: Getting names...`);

  const names = await getNames(groupVersionKind);
  const plural = names.name;

  console.log(`${resourceType}: Plural: ${plural}`);

  const o = new OpenAI();

  console.log(`${resourceType}: Generating UI...`);

  const response = await o.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: `Schema: ${JSON.stringify(schema)}`,
      },
    ]
  });

  let output: CompletionOutput = JSON.parse(response.choices[0].message.content!);

  console.log(output);

  const group = groupVersionKind.group ? groupVersionKind.group : "core";
  const version = groupVersionKind.version;
  const outputdir = `components/views/${group}/${version}`;

  mkdirSync(outputdir, { recursive: true });
  writeFileSync(join(outputdir, `${plural}.tsx`), output.tsxCode);

  const icon = output.lucideIcon;

  console.log(`${resourceType}: Writing metadata`);
  writeFileSync(join(outputdir, `${plural}.metadata.json`), JSON.stringify({
    group,
    plural,
    version,
    icon,
    description: output.description,
    kind: groupVersionKind.kind,
  }, null, 2));

  console.log(`${resourceType}: Updating sidebar...`);
  renderApiGroups();

  console.log(`${resourceType}: Done!`);
}

async function main() {
  if (!process.argv[2]) {
    console.error(`Usage: ${process.argv[1]} <resourceType> ...`);
    process.exit(1);
  }

  console.log("Fetching API model from cluster...");
  const result = await kubernetesRequest(`/openapi/v2`);
  const model = await result.json();

  for (const resource of process.argv.slice(2)) {
    await addResource(model, resource);
  }
}

main().catch(console.error);

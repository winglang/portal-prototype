import k8s from '@kubernetes/client-node';
import { mkdirSync, writeFileSync } from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';
import { listAvailableComponents } from "./all-components.mjs";

async function renderResourceUi(resourceType: string) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
  const resource = await k8sApi.getClusterCustomObject('apiextensions.k8s.io', 'v1', 'customresourcedefinitions', resourceType);

  const crd: k8s.V1CustomResourceDefinition = resource.body as k8s.V1CustomResourceDefinition;

  const outputdir = `app/[type]/[namespace]/[name]`;
  mkdirSync(outputdir, { recursive: true });


  const o = new OpenAI();

  console.log("Working...");
  const response = await o.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: 'You have a custom resource. Please render a shadcn/ui component for it.',
      },
      {
        role: 'system',
        content: "The component should be a pure UI component. The data should be provided via a single property called 'obj' which includes the api object contents based on the schema provided below.",
      },
      {
        role: 'system',
        content: `Use only these imports and these shadcn/ui components.: ${listAvailableComponents().join('\n')}`,
      },
      {
        role: "system",
        content: `You must import components via "@/components/ui/xxx". Each component needs to be individually imported. For example, if I want to import the Accordion component, I should write: import { Accordion } from "@/components/ui/accordion";`,
      },
      {
        role: 'system',
        content: "Write the following TypeScript code, but ensure that it is plain text with no markdown or formatting characters. Provide the following TypeScript code in plain text, without any markdown formatting or code block syntax.",
      },
      {
        role: 'user',
        content: `This is the definition resource so you can render names and icons and other UI affordances that are not part of the objects contents: ${JSON.stringify(crd, null, 2)}`,
      },
      {
        role: 'user',
        content: `This is the schema of the resource: ${JSON.stringify(crd.spec.versions[0].schema, null, 2)}`,
      }
    ]
  });

  const code = response.choices[0].message.content!;
  const group = crd.spec.group;
  const plural = crd.spec.names.plural;
  writeFileSync(join(outputdir, `${plural}.${group}.tsx`), code);
}

if (!process.argv[2]) {
  console.error('Usage: ts-node discover.mts <resourceType>');
  process.exit(1);
}

renderResourceUi(process.argv[2]).catch(console.error);
import k8s from '@kubernetes/client-node';
import { mkdirSync, writeFileSync } from 'fs';
import { OpenAI } from 'openai';
import { join } from 'path';
import { listAvailableComponents } from "./all-components.mjs";


const prompt = `
I have a JSON schema that displays the contents of a Kubernetes object, 
and I would like to generate a Next.js React component in Typescript that uses "shadcn/ui".
The component should include all the  fields from the object and use the most human friendly ui elements
to represent the value. For example: use a progress bar to represent percentage, use icons with colors to represent status
and generally just create a beautiful and colorful and rich ui for this object.

The component should include the kind of the object as a title, as well as any descriptions and details from the schema that make the interface more human friendly and readable.
Use emojis as much as possible to make the interface more human friendly and readable.

The generated component should:

0. The component API should be a single object with a single property called "obj" that includes the api object contents based on the schema provided below.
1. Import and use components from "@/components/ui/<component>.tsx", DO NOT, and I repeat, DO NOT improt "from '@/components/ui'"
2. Include TypeScript interfaces for type safety based on the JSON schema.
3. Be styled using "shadcn/ui" and follow best practices for responsive design.

Here is the list of allowed "shadcn/ui" imports:

${listAvailableComponents()}

Please provide a fully functional "shadcn/ui" component code that I can directly integrate into a Next.js app.

Write the following TypeScript code, but ensure that it is plain text with no markdown or formatting characters. Provide the following TypeScript code in plain text, without any markdown formatting or code block syntax.

Below you will find the JSON schema that represents the Kubernetes object as well as the CRD definition.
`;

async function renderResourceUi(resourceType: string) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
  const resource = await k8sApi.getClusterCustomObject('apiextensions.k8s.io', 'v1', 'customresourcedefinitions', resourceType);

  const crd: k8s.V1CustomResourceDefinition = resource.body as k8s.V1CustomResourceDefinition;

  const o = new OpenAI();

  console.log("Working...");
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
        content: `CRD: ${JSON.stringify(crd, null, 2)}`,
      },
      {
        role: 'user',
        content: `Schema: ${JSON.stringify(crd.spec.versions[0].schema)}`,
      }
    ]
  });

  const code = response.choices[0].message.content!;
  const group = crd.spec.group;
  const version = crd.spec.versions[0].name;
  const plural = crd.spec.names.plural;
  const outputdir = `components/views/${group}/${version}`;

  mkdirSync(outputdir, { recursive: true });
  writeFileSync(join(outputdir, `${plural}.tsx`), code);
}

if (!process.argv[2]) {
  console.error('Usage: ts-node discover.mts <resourceType>');
  process.exit(1);
}

renderResourceUi(process.argv[2]).catch(console.error);
import k8s from '@kubernetes/client-node';
import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import { OpenAI } from 'openai';
import { join, resolve, dirname } from 'path';
import { listAvailableComponents } from "./all-components.mjs";


const __dirname = resolve(dirname(''));

const prompt = `
I have a JSON schema that displays the contents of a Kubernetes object.
I would like to auto generate a Next.js React UI component in Typescript that uses "shadcn/ui" and "tailwindcss".
The component should include all the  fields from the object and use the most human friendly ui elements
to represent the object values.
For example: 
In case one of the values is precentage, use a progress bar for representation, 
use with colors to represent the resource status,
and in general create a beautiful and rich ui for this object.

Some guidelines for the UI component:
- The component should fill the parent component height and width.
- Include the kind of the object as a title, as well as any descriptions.
- Display all the details from the schema and make sure the user interface is human friendly and readable as possible.
- Use collapbsible sections for displaying the object fields in a structured way.
- Use emojis when needed to make the interface more human friendly and readable.
- The component API should be a single object with a single property called "obj" that includes the api object contents based on the schema provided below.
- Only import UI components from "@/components/ui/<component>.tsx", DO NOT, and I repeat, DO NOT improt "from '@/components/ui'" directly.
- Include TypeScript interfaces for type safety based on the JSON schema.
- Use "shadcn/ui" and "tailwindcss" and follow best practices for responsive design.
- make sure the component is fully functional and can be directly integrated into a Next.js app. No typescript errors. No React errors.
- Run some tests on the created component to make sure it works as expected and all elements are displayed and functions as expected. 

Here is the list of allowed "shadcn/ui" imports:

${listAvailableComponents()}

Please provide a fully functional "shadcn/ui" and "tailwindcss" component code that I can directly integrate into a Next.js app.

Write the following TypeScript code, but ensure that it is plain text with no markdown or formatting characters. Provide the following TypeScript code in plain text, without any markdown formatting or code block syntax.

Below you will find the JSON schema that represents the Kubernetes object as well as the CRD definition.

Also, below you will find a React component template that you need to follow when creating the component. Make sure to follow all comments writen in the code.
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
      },
      {
          role: 'user',
          content: `Template React Component with comments that you need to follow: ${readFileSync(join(__dirname, '/scripts/template.tsx'), 'utf-8')}`,
      },
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
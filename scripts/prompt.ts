import { readFileSync } from "fs";
import { listAvailableComponents } from "./all-components";
import { join } from "path";

export const prompt = `
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

- This is a template of how a resource object component should look like.
- The number of properties and the name of the properties can change from one resource object to another.
- The number of nested sections and the name of the properties can change from one resource object to another.
- Do not display non exists properties and sections. If the array is empty or the property doesn't exist - do not add the section
- Check if the property exists before displaying it and if a nested object has values before displaying it and its' properties
- If you won't follow these instructions, the website will crash
- Make sure to "null-check" every value before displaying it.

Here is the list of allowed "shadcn/ui" imports:

${listAvailableComponents()}

Please provide a fully functional "shadcn/ui" and "tailwindcss" component code that I can directly integrate into a Next.js app.

Write the following TypeScript code, but ensure that it is plain text with no markdown or formatting characters. Provide the following TypeScript code in plain text, without any markdown formatting or code block syntax.

Below you will find the JSON schema that represents the Kubernetes object as well as the CRD definition.

Here is the template of the React component:

${readFileSync(join(__dirname, 'template.tsx'), 'utf-8')}

OUTPUT FORMAT MUST BE a plain .tsx file, no markdown, no code blocks, no comments, no additional text.
`;

// export const prompt = `
// Generate TypeScript code for a Next.js React UI component that displays a Kubernetes object based on the provided JSON schema.
// The component should be written in a way that it can be directly integrated into a Next.js app.

// Here is the finite list of allowed "shadcn/ui" imports:
// --BEGIN--
// ${listAvailableComponents()}
// --END--

// Here is a template for the output:

// export default function View({ obj }: { obj: any }) {
//   <generated code here>
// }
// `;

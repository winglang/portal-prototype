export interface CompletionOutput {
  tsxCode: string; // <-- this is the .tsx file that contains the component
  lucideIcon: string; // <-- this is the name of a lucide icon to use for the component (represents the resource itself)
  description: string; // <-- this is a short description of the resource
}

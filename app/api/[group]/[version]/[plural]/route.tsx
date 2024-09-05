import { Params } from "@/app/types";
import { kubernetesRequest } from "@/lib/k8s";

export async function GET(req: Request, { params }: { params: Params }): Promise<Response> {
  const url = [];
 
  if (params.group === "core") {
    url.push("api");
  } else {
    url.push("apis");
    url.push(params.group); 
  }

  url.push(params.version);
  url.push(params.plural);

  return kubernetesRequest(url.join("/"));
}
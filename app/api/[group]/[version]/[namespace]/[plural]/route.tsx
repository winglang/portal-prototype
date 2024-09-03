import { Params } from "@/app/types";
import * as k8s from "@kubernetes/client-node";

export async function GET(req: Request, { params }: { params: Params }): Promise<Response> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  // return all kubernetes resources in the namespace
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

  const resources = await k8sApi.listNamespacedCustomObject(params.group, params.version, params.namespace, params.plural);
  
  return new Response(JSON.stringify((resources.body as any).items), {
    headers: { 'Content-Type': 'application/json' },
  });
}
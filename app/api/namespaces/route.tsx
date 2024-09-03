import * as k8s from "@kubernetes/client-node";

export async function GET(req: Request): Promise<Response> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const resources = await k8sApi.listNamespace();
  
  const result = {
    namespaces: (resources.body as any).items.map((item: any) => item.metadata.name),
  };

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}
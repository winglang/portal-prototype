import * as k8s from "@kubernetes/client-node";

export async function GET(req: Request): Promise<Response> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);


  try {
    const namespaceApi = kc.makeApiClient(k8s.CoreV1Api);
    const namespaceResponse = await namespaceApi.listNamespace();
    const namespaces = namespaceResponse.body.items.map(ns => ns.metadata?.name);

    return new Response(JSON.stringify({ namespaces }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching namespaces:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch namespaces' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
'use server'

import { Params } from "@/app/types";
import * as k8s from "@kubernetes/client-node";

export async function GET(req: Request, { params }: { params: Params }): Promise<Response> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

  try {
    const resource = await k8sApi.getNamespacedCustomObject(
      params.group,
      params.version,
      params.namespace,
      params.plural,
      params.name
    );
    return new Response(JSON.stringify(resource.body));

  } catch (error: any) {
    if (error.response && error.response.statusCode === 404) {
      return new Response(`Resource ${params.group}/${params.version}/${params.plural}/${params.namespace}/${params.name} not found`, { status: 404 });
    }
    throw error;
  }

}


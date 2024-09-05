import { kubernetesRequest } from "@/lib/k8s";

type Names = {
  name: string;
  singularName: string;
  namespaced: boolean;
  kind: string;
  verbs: string[];
  shortNames: string[];
  categories: string[];
}

export async function getNames({ group, version, kind }: { group: string, version: string, kind: string }) {
  const url = [];

  if (group !== "") {
    url.push("apis");
    url.push(group);
  } else {
    url.push("api");
  }

  url.push(version);

  const response = await kubernetesRequest(`/${url.join("/")}`)
  const data = await response.json()
  return data.resources.find((resource: any) => resource.kind === kind) as Names;
}

// getNames({
//   group: "acme.com",
//   version: "v1",
//   kind: "Workload"
// }).then((data) => {
//   console.log(data);
// });
import { Params } from "@/app/types";
import * as k8s from "@kubernetes/client-node";
import * as request from "request";

export async function GET(req: Request, { params }: { params: Params }): Promise<Response> {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  console.log("here!", params);

  const server = kc.getCurrentCluster()?.server;

  if (!server) {
    return new Response("No server found", { status: 500 });
  }

  const url = [ server ];
 
  if (params.group === "core") {
    url.push("api");
  } else {
    url.push("apis");
    url.push(params.group); 
  }

  url.push(params.version);
  url.push(params.plural);

  const options: request.Options = {
    url: url.join("/"),
  };

  await kc.applyToRequest(options);

  return new Promise((resolve, reject) => {
    request.get(options, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`${res.statusMessage} ${options.url}`));
      }
  
      return resolve(new Response(body));
    });
  });
}
import { Accordion } from "@/components/ui/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AllowType = {
  apiGroup: string;
  resource: string;
  verbs: string[];
};

type EnvFromType = {
  configMap?: {
    key: string;
    name: string;
  };
  optional?: boolean;
  secret?: {
    key: string;
    name: string;
    namespace?: string;
  };
};

type EnvSecretsType = {
  key: string;
  name: string;
};

type ConditionType = {
  type: string;
  status: string;
  lastTransitionTime: string;
  message?: string;
};

type StatusType = {
  conditions?: ConditionType[];
  host?: string;
  port?: string;
};

type CustomResourceType = {
  allow?: AllowType[];
  allowCluster?: AllowType[];
  command?: string[];
  env?: { [key: string]: string };
  envFrom?: { [key: string]: EnvFromType };
  envSecrets?: { [key: string]: EnvSecretsType };
  image: string;
  port?: number;
  readiness?: string[];
  replicas?: number;
  rewrite?: string;
  route?: string;
  status?: StatusType;
};

type Props = {
  obj: CustomResourceType;
};

const CustomResourceComponent = ({ obj }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Resource Details</CardTitle>
        <CardDescription>
          Details of the custom resource definition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {/* Image */}
          <AccordionItem value="image">
            <AccordionTrigger>Image</AccordionTrigger>
            <AccordionContent>
              <p>{obj.image}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Allow */}
          {obj.allow && (
            <AccordionItem value="allow">
              <AccordionTrigger>Allow</AccordionTrigger>
              <AccordionContent>
                {obj.allow.map((allowItem, index) => (
                  <div key={index}>
                    <p>API Group: {allowItem.apiGroup}</p>
                    <p>Resource: {allowItem.resource}</p>
                    <p>Verbs: {allowItem.verbs.join(", ")}</p>
                    <Separator />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Allow Cluster */}
          {obj.allowCluster && (
            <AccordionItem value="allowCluster">
              <AccordionTrigger>Allow Cluster</AccordionTrigger>
              <AccordionContent>
                {obj.allowCluster.map((allowClusterItem, index) => (
                  <div key={index}>
                    <p>API Group: {allowClusterItem.apiGroup}</p>
                    <p>Resource: {allowClusterItem.resource}</p>
                    <p>Verbs: {allowClusterItem.verbs.join(", ")}</p>
                    <Separator />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Command */}
          {obj.command && (
            <AccordionItem value="command">
              <AccordionTrigger>Command</AccordionTrigger>
              <AccordionContent>
                <p>{obj.command.join(" ")}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Environment Variables */}
          {obj.env && (
            <AccordionItem value="env">
              <AccordionTrigger>Environment Variables</AccordionTrigger>
              <AccordionContent>
                {Object.entries(obj.env).map(([key, value]) => (
                  <div key={key}>
                    <p>
                      {key}: {value}
                    </p>
                    <Separator />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Environment Variables From */}
          {obj.envFrom && (
            <AccordionItem value="envFrom">
              <AccordionTrigger>Environment Variables From</AccordionTrigger>
              <AccordionContent>
                {Object.entries(obj.envFrom).map(([key, value]) => (
                  <div key={key}>
                    {value.configMap && (
                      <div>
                        <p>ConfigMap Key: {value.configMap.key}</p>
                        <p>ConfigMap Name: {value.configMap.name}</p>
                      </div>
                    )}
                    {value.secret && (
                      <div>
                        <p>Secret Key: {value.secret.key}</p>
                        <p>Secret Name: {value.secret.name}</p>
                        {value.secret.namespace && (
                          <p>Secret Namespace: {value.secret.namespace}</p>
                        )}
                      </div>
                    )}
                    {value.optional !== undefined && (
                      <p>Optional: {value.optional ? "True" : "False"}</p>
                    )}
                    <Separator />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Environment Secrets */}
          {obj.envSecrets && (
            <AccordionItem value="envSecrets">
              <AccordionTrigger>Environment Secrets</AccordionTrigger>
              <AccordionContent>
                {Object.entries(obj.envSecrets).map(([key, value]) => (
                  <div key={key}>
                    <p>
                      {key}: {value.name}
                    </p>
                    <Separator />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Port */}
          {obj.port && (
            <AccordionItem value="port">
              <AccordionTrigger>Port</AccordionTrigger>
              <AccordionContent>
                <p>{obj.port}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Readiness */}
          {obj.readiness && (
            <AccordionItem value="readiness">
              <AccordionTrigger>Readiness</AccordionTrigger>
              <AccordionContent>
                <p>{obj.readiness.join(", ")}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Replicas */}
          {obj.replicas && (
            <AccordionItem value="replicas">
              <AccordionTrigger>Replicas</AccordionTrigger>
              <AccordionContent>
                <p>{obj.replicas}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Rewrite */}
          {obj.rewrite && (
            <AccordionItem value="rewrite">
              <AccordionTrigger>Rewrite</AccordionTrigger>
              <AccordionContent>
                <p>{obj.rewrite}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Route */}
          {obj.route && (
            <AccordionItem value="route">
              <AccordionTrigger>Route</AccordionTrigger>
              <AccordionContent>
                <p>{obj.route}</p>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Status */}
          {obj.status && (
            <AccordionItem value="status">
              <AccordionTrigger>Status</AccordionTrigger>
              <AccordionContent>
                {obj.status.conditions && (
                  <div>
                    <h3>Conditions:</h3>
                    {obj.status.conditions.map((condition, index) => (
                      <div key={index}>
                        <p>Type: {condition.type}</p>
                        <p>Status: {condition.status}</p>
                        <p>Last Transition Time: {condition.lastTransitionTime}</p>
                        {condition.message && <p>Message: {condition.message}</p>}
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
                {obj.status.host && <p>Host: {obj.status.host}</p>}
                {obj.status.port && <p>Port: {obj.status.port}</p>}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Edit</Button>
        <Button variant="solid">Save</Button>
      </CardFooter>
    </Card>
  );
};

export default CustomResourceComponent;
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableFooter } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { TableCaption } from "@/components/ui/table";

interface AllowEntry {
  apiGroup: string;
  resource: string;
  verbs: string[];
}

interface EnvConfigMap {
  key: string;
  name: string;
}

interface EnvSecret {
  key: string;
  name: string;
  namespace?: string;
}

interface EnvFrom {
  configMap?: {
    key: string;
    name: string;
  };
  optional?: boolean;
  secret?: EnvSecret;
}

interface EnvSecrets {
  key: string;
  name: string;
}

interface StatusCondition {
  type: string;
  status: string;
  lastTransitionTime: string;
  lastProbeTime?: string;
  message?: string;
}

interface Status {
  conditions?: StatusCondition[];
  host?: string;
  port?: string;
}

interface WorkloadProps {
  obj: {
    allow?: AllowEntry[];
    allowCluster?: AllowEntry[];
    command?: string[];
    env?: Record<string, string>;
    envFrom?: Record<string, EnvFrom>;
    envSecrets?: Record<string, EnvSecrets>;
    image: string;
    port?: number;
    readiness?: string[];
    replicas?: number;
    rewrite?: string;
    route?: string;
    status?: Status;
  };
}

const WorkloadComponent: React.FC<WorkloadProps> = ({ obj }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🚀 Workload</CardTitle>
        <CardDescription>Details about your Kubernetes workload.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="general">
            <AccordionTrigger>General Information</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>{obj.image}</TableCell>
                  </TableRow>
                  {obj.port && (
                    <TableRow>
                      <TableCell>Port</TableCell>
                      <TableCell>{obj.port}</TableCell>
                    </TableRow>
                  )}
                  {obj.replicas && (
                    <TableRow>
                      <TableCell>Replicas</TableCell>
                      <TableCell>{obj.replicas}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="status">
            <AccordionTrigger>Status 🚥</AccordionTrigger>
            <AccordionContent>
              {obj.status?.conditions?.map((condition, idx) => (
                <Table key={idx}>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Message</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge>{condition.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {condition.status === "True" ? "✅" : "❌"}
                      </TableCell>
                      <TableCell>{condition.message}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ))}
              {obj.status?.host && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Host</TableCell>
                      <TableCell>{obj.status.host}</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Port</TableCell>
                      <TableCell>{obj.status.port}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </AccordionContent>
          </AccordionItem>
        
              <AccordionItem value="env">
                <AccordionTrigger>Environment Variables 🌱</AccordionTrigger>
                <AccordionContent>
                  {obj.env && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(obj.env).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {obj.envFrom && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Source</TableCell>
                          <TableCell>Details</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(obj.envFrom).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>
                              {value.configMap ? (
                                <>
                                  ConfigMap: {value.configMap.name}/{value.configMap.key}
                                </>
                              ) : (
                                <>
                                  Secret: {value.secret?.name}/{value.secret?.key}
                                </>
                              )}
                              {value.optional && " (Optional)"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </AccordionContent>
              </AccordionItem>
          
              <AccordionItem value="commands">
                <AccordionTrigger>Commands 🚀</AccordionTrigger>
                <AccordionContent>
                  {obj.command && (
                    <ul>
                      {obj.command.map((cmd, idx) => (
                        <li key={idx}>{cmd}</li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
          
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default WorkloadComponent;
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableFooter } from "@/components/ui/table";

interface Condition {
  lastTransitionTime: string;
  lastProbeTime?: string;
  message: string;
  status: string;
  type: string;
}

interface Repo {
  name: string;
  owner: string;
  public?: boolean;
}

interface KubernetesObject {
  configOnly?: boolean;
  repo: Repo;
  status?: {
    conditions?: Condition[];
  };
}

interface KubernetesCardProps {
  obj: KubernetesObject;
}

const KubernetesCard: React.FC<KubernetesCardProps> = ({ obj }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🛠️ Service</CardTitle>
        <CardDescription>Details of the service from the Kubernetes CRD.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <div>
          <h2>Repository Info:</h2>
          <p><strong>Name:</strong> {obj.repo.name}</p>
          <p><strong>Owner:</strong> {obj.repo.owner}</p>
          {obj.repo.public !== undefined && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={obj.repo.public ? "success" : "secondary"}>
                  {obj.repo.public ? "Public" : "Private"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {obj.repo.public ? "This repository is public." : "This repository is private."}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {obj.configOnly !== undefined && (
          <div>
            <h2>Configuration:</h2>
            <p>This service is {obj.configOnly ? "" : "not "}config-only.</p>
          </div>
        )}

        {obj.status && obj.status.conditions && (
          <div>
            <h2>Status Info:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Last Transition Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obj.status.conditions.map((condition, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{condition.type}</TableCell>
                    <TableCell>
                      <Badge variant={condition.status === "True" ? "success" : "danger"}>
                        {condition.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{condition.message}</TableCell>
                    <TableCell>{new Date(condition.lastTransitionTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KubernetesCard;
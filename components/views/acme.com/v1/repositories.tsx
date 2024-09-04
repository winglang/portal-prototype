
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui";

interface KubernetesObject {
  files: {
    content: string;
    path: string;
    readonly?: boolean;
  }[];
  name: string;
  owner: string;
  public?: boolean;
  status?: {
    conditions?: {
      lastProbeTime?: string;
      lastTransitionTime: string;
      message?: string;
      status: string;
      type: string;
    }[];
  };
  tags?: string[];
}

export default function View({ obj }: { obj: KubernetesObject }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{obj.name}</CardTitle>
        <CardDescription>Owned by {obj.owner}</CardDescription>
        {obj.public && <Badge variant="warning">Public</Badge>}
      </CardHeader>
      <CardContent>
        {obj.tags && (
          <>
            <h3>Tags:</h3>
            {obj.tags.map((tag, index) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </>
        )}
        <h3>Files:</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Read-only</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obj.files.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.path}</TableCell>
                <TableCell>{file.content}</TableCell>
                <TableCell>{file.readonly ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {obj.status?.conditions && (
          <>
            <h3>Status Conditions:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Probe Time</TableHead>
                  <TableHead>Last Transition Time</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obj.status.conditions.map((condition, index) => (
                  <TableRow key={index}>
                    <TableCell>{condition.type}</TableCell>
                    <TableCell>{condition.status}</TableCell>
                    <TableCell>{condition.lastProbeTime || "N/A"}</TableCell>
                    <TableCell>{condition.lastTransitionTime}</TableCell>
                    <TableCell>{condition.message || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

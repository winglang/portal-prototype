
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

type AllowProps = { apiGroup: string; resource: string; verbs: string[] };
type EnvSecretsProps = { key: string; name: string; namespace?: string };
type EnvFromProps = { key: string; name: string };
type ConditionsProps = {
  type: string; status: string; lastTransitionTime: string;
  lastProbeTime?: string; message?: string;
};

export default function View({ obj }: { obj: any }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
          <CardDescription>{obj.image}</CardDescription>
        </CardHeader>
        <CardContent>
          {obj.allow && obj.allow.length > 0 &&
            <div>
              <h3>Allow</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Group</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Verbs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obj.allow.map((item: AllowProps, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.apiGroup}</TableCell>
                      <TableCell>{item.resource}</TableCell>
                      <TableCell>{item.verbs.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          {obj.env &&
            <div>
              <h3>Environment Variables</h3>
              <Table>
                <TableBody>
                  {Object.entries(obj.env).map(([key, value]: [string, string]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          {obj.envFrom &&
            <div>
              <h3>Environment From</h3>
              <Table>
                <TableBody>
                  {Object.entries(obj.envFrom).map(([key, value]: [string, EnvFromProps]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          {obj.envSecrets &&
            <div>
              <h3>Environment Secrets</h3>
              <Table>
                <TableBody>
                  {Object.entries(obj.envSecrets).map(([key, value]: [string, EnvSecretsProps]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value.name}</TableCell>
                      <TableCell>{value.namespace}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          {obj.status && obj.status.conditions && obj.status.conditions.length > 0 &&
            <div>
              <h3>Status Conditions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Transition Time</TableHead>
                    <TableHead>Last Probe Time</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obj.status.conditions.map((condition: ConditionsProps, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{condition.type}</TableCell>
                      <TableCell>{condition.status}</TableCell>
                      <TableCell>{condition.lastTransitionTime}</TableCell>
                      <TableCell>{condition.lastProbeTime}</TableCell>
                      <TableCell>{condition.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}

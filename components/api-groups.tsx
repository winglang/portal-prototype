import * as icons from "lucide-react";

export const apiGroups = [
  { group: "acme.com/v1/workloads", icon: icons.Settings, kind: "Workload", plural: "workloads" },
  { group: "acme.com/v1/services", icon: icons.Settings, kind: "Service", plural: "services" },
  { group: "core/v1/pods", icon: icons.Settings, kind: "Pod", plural: "pods" },
];
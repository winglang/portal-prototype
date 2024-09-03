'use client'

import { useEffect, useState } from "react";

export default function Page({ params }: { params: { name: string, namespace: string, type: string } }) {

  const [View, setView] = useState<any | null>(null);

  useEffect(() => {
    import(`./${params.type}`).then(module => {
      setView(() => module.default);
    });
  }, [params.type]);

  const obj = {
    "apiVersion": "acme.com/v1",
    "env": {
      "ECHO_TEXT": "bing"
    },
    "image": "hashicorp/http-echo",
    "kind": "Workload",
    "metadata": {
      "annotations": {
        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"acme.com/v1\",\"env\":{\"ECHO_TEXT\":\"bing\"},\"image\":\"hashicorp/http-echo\",\"kind\":\"Workload\",\"metadata\":{\"annotations\":{},\"labels\":{\"foo\":\"bar\",\"hello\":\"world\"},\"name\":\"my-workload\",\"namespace\":\"default\"},\"port\":5678,\"replicas\":2,\"rewrite\":\"/$2\",\"route\":\"/my-service(/|$)(.*)\"}\n"
      },
      "creationTimestamp": "2024-09-03T12:25:00Z",
      "generation": 1,
      "labels": {
        "foo": "bar",
        "hello": "world"
      },
      "name": "my-workload",
      "namespace": "default",
      "resourceVersion": "7276823",
      "uid": "d49f94a0-080c-46f9-9729-60beaa0387c5"
    },
    "port": 5678,
    "replicas": 2,
    "rewrite": "/$2",
    "route": "/my-service(/|$)(.*)",
    "status": {
      "conditions": [
        {
          "lastProbeTime": "2024-09-03T12:25:01.656Z",
          "lastTransitionTime": "2024-09-03T12:25:09.383Z",
          "message": "Success",
          "status": "True",
          "type": "Ready"
        }
      ],
      "host": "my-workload-deployment-service-c8eace3e",
      "port": "5678"
    }
  };

  return (View && obj) ? <View obj={obj}/> : <div>Loading...</div>;
}
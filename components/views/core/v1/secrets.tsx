import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Alert } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectGroup, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Box, Tag, Server, Globe, Cpu, Zap, XCircle } from 'lucide-react'

interface ObjectMeta {
  name: string;
  namespace?: string;
  resourceVersion?: string;
  uid?: string;
  creationTimestamp?: string;
  deletionTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  generation?: number;
  annotations?: {
    [key: string]: string;
  };
  labels?: {
    [key: string]: string;
  };
}

interface Secret {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMeta;
  data?: {
    [key: string]: string;
  };
  stringData?: {
    [key: string]: string;
  };
  type?: string;
  immutable?: boolean;
}

interface Props {
  obj: Secret;
}

const KubernetesSecretViewer: React.FC<Props> = ({ obj }) => {
  const [showMetadata, setShowMetadata] = useState(false)
  const [showData, setShowData] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Box className="w-8 h-8" />
            <span>{obj.metadata?.name}</span>
            <Badge className="bg-yellow-500 text-yellow-900">{obj.kind}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {obj.apiVersion && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-gray-800">API Version:</span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.apiVersion}</code>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The version of the API used by this resource</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {obj.type && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                      <Tag className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-gray-800">Type:</span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.type}</code>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The type of the secret</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {obj.metadata?.namespace && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                      <Globe className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-gray-800">Namespace:</span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.metadata.namespace}</code>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The namespace of this resource</p>
                  </TooltipContent>
                </Tooltip>
              )}

            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowMetadata(!showMetadata)}
              >
                <span className="font-semibold">Metadata</span>
                {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              {showMetadata && (
                <div className="pl-6 space-y-2 animate-fadeIn">
                  {obj.metadata?.name && <div>Name: <Badge className="bg-blue-100 text-blue-800">{obj.metadata.name}</Badge></div>}
                  {obj.metadata?.namespace && <div>Namespace: <Badge className="bg-blue-100 text-blue-800">{obj.metadata.namespace}</Badge></div>}
                  {obj.metadata?.resourceVersion && <div>Resource Version: <Badge className="bg-green-100 text-green-800">{obj.metadata.resourceVersion}</Badge></div>}
                  {obj.metadata?.uid && <div>UID: <Badge className="bg-purple-100 text-purple-800">{obj.metadata.uid}</Badge></div>}
                  {obj.metadata?.creationTimestamp && <div>Created: <Badge className="bg-yellow-100 text-yellow-800">{formatDate(obj.metadata.creationTimestamp)}</Badge></div>}
                  {obj.metadata?.deletionTimestamp && <div>Deletion Timestamp: <Badge className="bg-red-100 text-red-800">{formatDate(obj.metadata.deletionTimestamp)}</Badge></div>}
                  {obj.metadata?.deletionGracePeriodSeconds && <div>Deletion Grace Period Seconds: <Badge className="bg-orange-100 text-orange-800">{obj.metadata.deletionGracePeriodSeconds}</Badge></div>}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowData(!showData)}
              >
                <span className="font-semibold">Data</span>
                {showData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              {showData && (
                <div className="pl-6 space-y-2 animate-fadeIn">
                  {obj.data && Object.entries(obj.data).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">{key}</code>
                      <span>=</span>
                      <code className="bg-green-100 px-2 py-1 rounded text-green-800">{atob(value)}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KubernetesSecretViewer
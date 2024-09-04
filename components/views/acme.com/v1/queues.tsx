import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertOctagon, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert } from "@/components/ui/alert"
import { AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Condition {
    lastProbeTime?: string
    lastTransitionTime: string
    message?: string
    status: string
    type: string
}

interface ObjectStatus {
    conditions?: Condition[]
    queueUrl?: string
}

interface KubernetesObject {
    apiVersion: string
    kind: string
    metadata: {
        name: string
        namespace?: string
        resourceVersion?: string
        uid?: string
        creationTimestamp?: string
        labels?: Record<string, string>
        annotations?: Record<string, string>
    }
    spec?: {
        timeoutSec?: number
    }
    status?: ObjectStatus
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const HumanFriendlyBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
        {children}
    </span>
)

export default function KubernetesObjectViewer({ obj }: { obj: KubernetesObject }) {
    const [showMetadata, setShowMetadata] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <AlertOctagon className="w-8 h-8" />
                            <span>{obj.metadata.name}</span>
                            <HumanFriendlyBadge color="bg-yellow-500 text-yellow-900">{obj.kind}</HumanFriendlyBadge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Badge className="w-5 h-5 text-blue-500" />
                                            <span className="font-semibold text-gray-800">API Version:</span>
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.apiVersion}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The version of the API used by this workload</p>
                                    </TooltipContent>
                                </Tooltip>
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
                                        {obj.metadata.namespace && (
                                            <div>Namespace: <HumanFriendlyBadge color="bg-blue-100 text-blue-800">{obj.metadata.namespace}</HumanFriendlyBadge></div>
                                        )}
                                        {obj.metadata.resourceVersion && (
                                            <div>Resource Version: <HumanFriendlyBadge color="bg-green-100 text-green-800">{obj.metadata.resourceVersion}</HumanFriendlyBadge></div>
                                        )}
                                        {obj.metadata.uid && (
                                            <div>UID: <HumanFriendlyBadge color="bg-purple-100 text-purple-800">{obj.metadata.uid}</HumanFriendlyBadge></div>
                                        )}
                                        {obj.metadata.creationTimestamp && (
                                            <div>Created: <HumanFriendlyBadge color="bg-yellow-100 text-yellow-800">{formatDate(obj.metadata.creationTimestamp)}</HumanFriendlyBadge></div>
                                        )}
                                        {obj.metadata.labels && Object.keys(obj.metadata.labels).length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                Labels:
                                                {Object.entries(obj.metadata.labels).map(([key, value]) => (
                                                    <Badge key={key} variant="outline" className="bg-gray-200 text-gray-800">
                                                        {key}: {value}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={() => setShowStatus(!showStatus)}
                                >
                                    <span className="font-semibold">Status</span>
                                    {showStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                                {showStatus && obj.status && (
                                    <div className="pl-6 space-y-2 animate-fadeIn">
                                        {obj.status.queueUrl && (
                                            <div>Queue URL: <HumanFriendlyBadge color="bg-cyan-100 text-cyan-800">{obj.status.queueUrl}</HumanFriendlyBadge></div>
                                        )}
                                        {obj.status.conditions?.map((condition, index) => (
                                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800">Type: {condition.type}</div>
                                                <div>Status:
                                                    <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                                                        {condition.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-gray-700">Message: {condition.message}</div>
                                                <div className="text-xs text-gray-600">Last Probe: {condition.lastProbeTime && formatDate(condition.lastProbeTime)}</div>
                                                <div className="text-xs text-gray-600">Last Transition: {condition.lastTransitionTime && formatDate(condition.lastTransitionTime)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
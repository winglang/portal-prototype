import { useState } from 'react'
import { ChevronDown, ChevronUp, Box, Tag, Shield, Zap, CheckCircle, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

// TypeScript interfaces for type safety
interface Condition {
    lastProbeTime?: string
    lastTransitionTime: string
    message?: string
    status: string
    type: string
}

interface Status {
    conditions: Condition[]
}

interface Repo {
    name: string
    owner: string
    public?: boolean
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
    }
    spec: {
        configOnly?: boolean
        repo: Repo
    }
    status?: Status
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const StatusBadge = ({ status }: { status: string }) => {
    const color = status === 'True' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    return (
        <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
            {status === 'True' ? 'Ready' : 'Not Ready'}
        </span>
    )
}

export default function KubernetesObjectViewer({ obj }: { obj: KubernetesObject }) {
    const [showSpec, setShowSpec] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Box className="w-8 h-8" />
                            <span>{obj.metadata.name}</span>
                            <Badge variant="outline" className="bg-yellow-500 text-yellow-900">{obj.kind}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Tag className="w-5 h-5 text-blue-500" />
                                            <span className="font-semibold text-gray-800">API Version:</span>
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.apiVersion}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The version of the API used by this workload</p>
                                    </TooltipContent>
                                </Tooltip>
                                {obj.metadata.namespace && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Shield className="w-5 h-5 text-green-500" />
                                                <span className="font-semibold text-gray-800">Namespace:</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.metadata.namespace}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>The namespace of the object in the cluster</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Zap className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold text-gray-800">UID:</span>
                                            <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.metadata.uid}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>A unique identifier for this object</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Info className="w-5 h-5 text-purple-500" />
                                            <span className="font-semibold text-gray-800">Created:</span>
                                            <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.metadata.creationTimestamp && formatDate(obj.metadata.creationTimestamp)}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The date and time when the object was created</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={() => setShowSpec(!showSpec)}
                                >
                                    <span className="font-semibold">Specification</span>
                                    {showSpec ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                                {showSpec && (
                                    <div className="pl-6 space-y-2 animate-fadeIn">
                                        <div>Config Only: <Badge variant="outline" className="bg-gray-200 text-gray-800">{obj.spec.configOnly ? 'Yes' : 'No'}</Badge></div>
                                        <div>Repo:</div>
                                        <div className="pl-3 space-y-2">
                                            <div>Name: <Badge variant="outline" className="bg-green-100 text-green-800">{obj.spec.repo.name}</Badge></div>
                                            <div>Owner: <Badge variant="outline" className="bg-blue-100 text-blue-800">{obj.spec.repo.owner}</Badge></div>
                                            {obj.spec.repo.public !== undefined && (
                                                <div>Public: <Badge variant="outline" className="bg-purple-100 text-purple-800">{obj.spec.repo.public ? 'Yes' : 'No'}</Badge></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {obj.status && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            onClick={() => setShowStatus(!showStatus)}
                                        >
                                            <span className="font-semibold">Status</span>
                                            {showStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                        {showStatus && (
                                            <div className="pl-6 space-y-2 animate-fadeIn">
                                                {obj.status.conditions.map((condition, index) => (
                                                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                                        <div className="font-semibold text-gray-800">Type: {condition.type}</div>
                                                        <div>Status: <StatusBadge status={condition.status} /></div>
                                                        <div className="text-gray-700">Message: {condition.message}</div>
                                                        <div className="text-xs text-gray-600">Last Probe: {condition.lastProbeTime && formatDate(condition.lastProbeTime)}</div>
                                                        <div className="text-xs text-gray-600">Last Transition: {formatDate(condition.lastTransitionTime)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
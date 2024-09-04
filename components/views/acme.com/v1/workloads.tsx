import { useState } from 'react'
import { ChevronDown, ChevronUp, Box, Tag, Server, Globe, Cpu, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const BalancedBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
        {children}
    </span>
)

interface KubernetesObject {
    image: string;
    allow?: { apiGroup: string, resource: string, verbs: string[] }[];
    allowCluster?: { apiGroup: string, resource: string, verbs: string[] }[];
    command?: string[];
    env?: Record<string, string>;
    envFrom?: Record<string, { configMap?: { key: string, name: string }, optional?: boolean, secret?: { key: string, name: string, namespace?: string } }>;
    envSecrets?: Record<string, { key: string, name: string }>;
    port?: number;
    readiness?: string[];
    replicas?: number;
    rewrite?: string;
    route?: string;
    status?: {
        conditions?: { type: string, status: string, lastTransitionTime: string, lastProbeTime?: string, message?: string }[];
        host?: string;
        port?: string;
    };
}

export default function KubernetesObjectViewer({ obj }: { obj: KubernetesObject }) {
    const [showMetadata, setShowMetadata] = useState(false)
    const [showEnv, setShowEnv] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Box className="w-8 h-8" />
                            <span>{obj.image}</span>
                            <BalancedBadge color="bg-yellow-500 text-yellow-900">Kubernetes Object</BalancedBadge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Tag className="w-5 h-5 text-blue-500" />
                                            <span className="font-semibold text-gray-800">Image:</span>
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.image}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The Docker image used for this workload</p>
                                    </TooltipContent>
                                </Tooltip>

                                {obj.route && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Globe className="w-5 h-5 text-purple-500" />
                                                <span className="font-semibold text-gray-800">Route:</span>
                                                <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.route}</code>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>The URL path for accessing this workload</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {obj.replicas !== undefined && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Cpu className="w-5 h-5 text-red-500" />
                                                <span className="font-semibold text-gray-800">Replicas:</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.replicas}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Number of replicas for this workload</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {obj.port !== undefined && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Server className="w-5 h-5 text-green-500" />
                                                <span className="font-semibold text-gray-800">Port:</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.port}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>The port exposed by this workload</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {obj.readiness && obj.readiness.length > 0 && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Zap className="w-5 h-5 text-yellow-500" />
                                                <span className="font-semibold text-gray-800">Readiness:</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.readiness.join(', ')}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Readiness probes for this workload</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {obj.rewrite && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                                <Server className="w-5 h-5" />
                                                <span className="font-semibold text-gray-800">Rewrite:</span>
                                                <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.rewrite}</code>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Rewrite rules for this workload</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="space-y-4">
                                {obj.env && Object.keys(obj.env).length > 0 && (
                                    <div>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            onClick={() => setShowEnv(!showEnv)}
                                        >
                                            <span className="font-semibold">Environment Variables</span>
                                            {showEnv ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                        {showEnv && (
                                            <div className="pl-6 space-y-2 animate-fadeIn">
                                                {Object.entries(obj.env).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-yellow-500" />
                                                        <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">{key}</code>
                                                        <span>=</span>
                                                        <code className="bg-green-100 px-2 py-1 rounded text-green-800">{value}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {obj.status && (
                                    <div>
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
                                                {obj.status.host && (
                                                    <div>Host: <BalancedBadge color="bg-cyan-100 text-cyan-800">{obj.status.host}</BalancedBadge></div>
                                                )}
                                                {obj.status.port && (
                                                    <div>Port: <BalancedBadge color="bg-pink-100 text-pink-800">{obj.status.port}</BalancedBadge></div>
                                                )}
                                                {obj.status.conditions && obj.status.conditions.map((condition, index) => (
                                                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                                        <div className="font-semibold text-gray-800">Type: {condition.type}</div>
                                                        <div>Status:
                                                            <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                                                                {condition.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-gray-700">Message: {condition.message}</div>
                                                        <div className="text-xs text-gray-600">Last Probe: {condition.lastProbeTime ? formatDate(condition.lastProbeTime) : 'N/A'}</div>
                                                        <div className="text-xs text-gray-600">Last Transition: {formatDate(condition.lastTransitionTime)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
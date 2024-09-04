import { useState } from 'react'
import { ChevronDown, ChevronUp, Box, Tag, Clock, Server, Globe, Cpu, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const ColorfulBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${color}`}>
    {children}
  </span>
)

export default function ColorfulWorkloadViewer({obj}) {
    const [showMetadata, setShowMetadata] = useState(false)
    const [showEnv, setShowEnv] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    return (
        <TooltipProvider>
            <div className="h-full bg-gradient-to-br from-purple-100 to-pink-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Box className="w-8 h-8" />
                            <span>{obj.metadata.name}</span>
                            <ColorfulBadge color="bg-yellow-500">{obj.kind}</ColorfulBadge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-lg">
                                            <Tag className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold text-blue-800">API Version:</span>
                                            <code className="bg-blue-200 px-2 py-1 rounded text-blue-800">{obj.apiVersion}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The version of the API used by this workload</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 p-3 rounded-lg">
                                            <Server className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-800">Image:</span>
                                            <code className="bg-green-200 px-2 py-1 rounded text-green-800">{obj.image}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The Docker image used for this workload</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg">
                                            <Globe className="w-5 h-5 text-yellow-600" />
                                            <span className="font-semibold text-yellow-800">Route:</span>
                                            <code className="bg-yellow-200 px-2 py-1 rounded text-yellow-800">{obj.route}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The URL path for accessing this workload</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 p-3 rounded-lg">
                                            <Cpu className="w-5 h-5 text-red-600" />
                                            <span className="font-semibold text-red-800">Replicas:</span>
                                            <span className="bg-red-200 px-2 py-1 rounded text-red-800">{obj.replicas}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Number of replicas for this workload</p>
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
                                        <div>Namespace: <ColorfulBadge color="bg-indigo-500">{obj.metadata.namespace}</ColorfulBadge></div>
                                        <div>Resource Version: <ColorfulBadge color="bg-teal-500">{obj.metadata.resourceVersion}</ColorfulBadge></div>
                                        <div>UID: <ColorfulBadge color="bg-orange-500">{obj.metadata.uid}</ColorfulBadge></div>
                                        <div>Created: <ColorfulBadge color="bg-purple-500">{formatDate(obj.metadata.creationTimestamp)}</ColorfulBadge></div>
                                        <div className="flex flex-wrap gap-2">
                                            Labels:
                                            {Object.entries(obj.metadata.labels).map(([key, value]) => (
                                                <Badge key={key} variant="outline" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                                                    {key}: {value}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                        <div>Host: <ColorfulBadge color="bg-cyan-500">{obj.status.host}</ColorfulBadge></div>
                                        <div>Port: <ColorfulBadge color="bg-emerald-500">{obj.status.port}</ColorfulBadge></div>
                                        {obj.status.conditions.map((condition, index) => (
                                            <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                                                <div className="font-semibold text-purple-800">Type: {condition.type}</div>
                                                <div>Status:
                                                    <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                                                        {condition.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-pink-800">Message: {condition.message}</div>
                                                <div className="text-xs text-gray-600">Last Probe: {formatDate(condition.lastProbeTime)}</div>
                                                <div className="text-xs text-gray-600">Last Transition: {formatDate(condition.lastTransitionTime)}</div>
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
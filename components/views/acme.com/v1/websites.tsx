import { useState } from 'react'
import { ChevronDown, ChevronUp, Box, Server, Globe, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Condition {
    lastProbeTime?: string,
    lastTransitionTime: string,
    message?: string,
    status: string,
    type: string,
}

interface Status {
    conditions: Condition[]
}

interface KubernetesObject {
    backend: string,
    image: string,
    route: string,
    status?: Status,
}

interface Props {
    obj: KubernetesObject
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

const BalancedBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
    {children}
  </span>
)

export default function KubernetesObjectViewer({ obj }: Props) {
    const [showStatus, setShowStatus] = useState(false)

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Box className="w-8 h-8" />
                            <span>{obj.backend}</span>
                            <BalancedBadge color="bg-yellow-500 text-yellow-900">KubernetesObject</BalancedBadge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Server className="w-5 h-5 text-green-500" />
                                            <span className="font-semibold text-gray-800">Image:</span>
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.image}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The Docker image used for this workload</p>
                                    </TooltipContent>
                                </Tooltip>

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
                            </div>

                            {obj.status?.conditions && obj.status.conditions.length > 0 && (
                                <div className="space-y-4">
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
                                                    <div>Status:
                                                        <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                                                            {condition.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-gray-700">Message: {condition.message}</div>
                                                    <div className="text-xs text-gray-600">Last Probe: {condition.lastProbeTime && formatDate(condition.lastProbeTime)}</div>
                                                    <div className="text-xs text-gray-600">Last Transition: {formatDate(condition.lastTransitionTime)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
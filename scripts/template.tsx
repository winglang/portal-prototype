// This is a template of how a resource object component should look like.
// This is only an example. the schema can change from one resource object to another.
// The number of properties and the name of the properties can change from one resource object to another.
// The number of nested sections and the name of the properties can change from one resource object to another.
// Do not display non exists properties and sections. If the array is empty or the property doesn't exist - do not add the section
// Check if the property exists before displaying it and if a nested object has values before displaying it and its' properties
// If you won't follow these instructions, the website will crash
import { useState } from 'react'
// an example for how to import icons
import { ChevronDown, ChevronUp, Box, Tag, Server, Globe, Cpu, Zap } from 'lucide-react'
// an example for how to import ui components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// an example for a helper function
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}

// an example for a colored badge
const BalancedBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
    {children}
  </span>
)

// an example for a component with an obj object as prop
export default function BalancedWorkloadViewer({obj}) {
    // an example of how to control the visibility of different collapsible sections
    const [showMetadata, setShowMetadata] = useState(false)
    const [showEnv, setShowEnv] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    // this is template code for a component that displays a Kubernetes object properties
    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        {/* An example of how a selected resource object should look like */}
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Box className="w-8 h-8" />
                            <span>{obj.metadata.name}</span>
                            <BalancedBadge color="bg-yellow-500 text-yellow-900">{obj.kind}</BalancedBadge>
                        </CardTitle>
                    </CardHeader>
                    {/* An example of how the resource object properties should be rendered. The name of the properties and the amount can change from one resource object to another. do not display non exists property */}
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* All top level properties of a resource object should be displayed as in the below structure. The name of the properties and the amount can change from one resource object to another. do not display non exists property */}
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

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Server className="w-5 h-5 text-green-500" />
                                            <span className="font-semibold text-gray-800">Image:</span>
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj?.image}</code>
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
                                            <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj?.route}</code>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>The URL path for accessing this workload</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                            <Cpu className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold text-gray-800">Replicas:</span>
                                            <span className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj?.replicas}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Number of replicas for this workload</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            {/* All nested properties of a resource object should be displayed as in the below structure. The amount of nested sections, the name of the properties and the amount can change from one resource object to another. do not display non exists properties and sections. If the array is empty or the property doesn't exist - do not add the section */}
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
                                        <div>Namespace: <BalancedBadge color="bg-blue-100 text-blue-800">{obj.metadata.namespace}</BalancedBadge></div>
                                        <div>Resource Version: <BalancedBadge color="bg-green-100 text-green-800">{obj.metadata.resourceVersion}</BalancedBadge></div>
                                        <div>UID: <BalancedBadge color="bg-purple-100 text-purple-800">{obj.metadata.uid}</BalancedBadge></div>
                                        <div>Created: <BalancedBadge color="bg-yellow-100 text-yellow-800">{formatDate(obj.metadata.creationTimestamp)}</BalancedBadge></div>
                                        {/* An example of not displaying a section if the array of it's content is empty: If there are no Labels - do not add the Labels section*/}
                                        <div className="flex flex-wrap gap-2">
                                            Labels:
                                            {Object.entries(obj.metadata.labels).map(([key, value]) => (
                                                <Badge key={key} variant="outline" className="bg-gray-200 text-gray-800">
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
                                        <div>Host: <BalancedBadge color="bg-cyan-100 text-cyan-800">{obj.status.host}</BalancedBadge></div>
                                        <div>Port: <BalancedBadge color="bg-pink-100 text-pink-800">{obj.status.port}</BalancedBadge></div>
                                        {obj.status.conditions.map((condition, index) => (
                                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800">Type: {condition.type}</div>
                                                <div>Status:
                                                    <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                                                        {condition.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-gray-700">Message: {condition.message}</div>
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
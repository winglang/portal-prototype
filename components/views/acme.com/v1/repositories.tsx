import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, File, User, CheckSquare } from 'lucide-react'

interface Condition {
  lastProbeTime?: string
  lastTransitionTime: string
  message?: string
  status: string
  type: string
}

interface File {
  content: string
  path: string
  readonly?: boolean
}

interface Status {
  conditions?: Condition[]
}

interface KubernetesObj {
  files?: File[]
  name: string
  owner: string
  public?: boolean
  status?: Status
  tags?: string[]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const BalancedBadge = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <span className={`px-2 py-1 rounded-full ${color} text-xs font-semibold`}>
    {children}
  </span>
)

export default function KubernetesObjectViewer({ obj }: { obj: KubernetesObj }) {
  const [showFiles, setShowFiles] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-md">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckSquare className="w-8 h-8" />
              <span>{obj.name}</span>
              <BalancedBadge color="bg-yellow-500 text-yellow-900">Kubernetes Object</BalancedBadge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                      <User className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-gray-800">Owner:</span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.owner}</code>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The owner of this resource</p>
                  </TooltipContent>
                </Tooltip>

                {obj.public !== undefined && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                        <span className="font-semibold text-gray-800">Public:</span>
                        <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{obj.public ? "Yes" : "No"}</code>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Whether this resource is public or private</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowFiles(!showFiles)}
                >
                  <span className="font-semibold">Files</span>
                  {showFiles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                {showFiles && obj.files && (
                  <div className="pl-6 space-y-2 animate-fadeIn">
                    {obj.files.map((file, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-semibold text-gray-800">Path: {file.path}</div>
                        <div className="text-gray-700">Content: {file.content}</div>
                        {file.readonly && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 mt-2">
                            Read-only
                          </Badge>
                        )}
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
                {showStatus && obj.status?.conditions && (
                  <div className="pl-6 space-y-2 animate-fadeIn">
                    {obj.status.conditions.map((condition, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-semibold text-gray-800">Type: {condition.type}</div>
                        <div>Status:
                          <Badge variant={condition.status === 'True' ? 'success' : 'destructive'} className="ml-2">
                            {condition.status}
                          </Badge>
                        </div>
                        {condition.message && <div className="text-gray-700">Message: {condition.message}</div>}
                        <div className="text-xs text-gray-600">Last Probe: {condition.lastProbeTime && formatDate(condition.lastProbeTime)}</div>
                        <div className="text-xs text-gray-600">Last Transition: {formatDate(condition.lastTransitionTime)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {obj.tags && obj.tags.length > 0 && (
                  <div className="pl-6 space-y-2 animate-fadeIn">
                    <div className="font-semibold text-gray-800">Tags:</div>
                    <div className="flex flex-wrap gap-2">
                      {obj.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-200 text-gray-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
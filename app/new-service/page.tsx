'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Server, Globe, Zap, Database, FileCode } from "lucide-react"

const projectTemplates = [
  { icon: Server, title: "Node.js Backend", description: "A scalable Node.js backend service" },
  { icon: FileCode, title: "Go Backend", description: "High-performance Go backend service" },
  { icon: Globe, title: "React Frontend", description: "Modern React frontend application" },
  { icon: Zap, title: "Async Workload", description: "Asynchronous task processing service" },
  { icon: Database, title: "Data Workflow", description: "Data processing and analytics pipeline" },
  { icon: FileCode, title: "Python API", description: "FastAPI-based Python API service" },
]

export default function NewServiceDialog() {
  const [open, setOpen] = useState(true)
  const [repoType, setRepoType] = useState("new")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Service Name
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Github className="h-4 w-4" />
              <Input id="name" placeholder="my-new-service" className="flex-grow" />
            </div>
          </div>
          <RadioGroup defaultValue="new" className="grid grid-cols-2 gap-4" onValueChange={setRepoType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Create new repository</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Use existing repository</Label>
            </div>
          </RadioGroup>
          {repoType === "new" ? (
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {projectTemplates.map((template, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedTemplate === template.title ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.title)}
                  >
                    <div className="flex items-center space-x-2">
                      <template.icon className="h-5 w-5" />
                      <h3 className="font-semibold">{template.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select existing repository" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repo1">existing-repo-1</SelectItem>
                <SelectItem value="repo2">existing-repo-2</SelectItem>
                <SelectItem value="repo3">existing-repo-3</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Create Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
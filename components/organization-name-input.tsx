'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function OrganizationNameInput() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input type="text" id="organizationName" placeholder="Enter organization name" />
      </div>
      <Button className="w-full">
        Next
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
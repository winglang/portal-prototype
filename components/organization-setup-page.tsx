'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrganizationSetupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set Up Your Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input type="text" id="organizationName" placeholder="Enter organization name" />
            </div>
            <Button className="w-full">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
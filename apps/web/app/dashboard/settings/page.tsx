"use client"

import { motion } from "framer-motion"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const handleLogout = () => {
    // With Clerk, you would use signOut from useClerk hook
    // For now, redirect to home or login
    window.location.href = "/"
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings.</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Your personal account details</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-serif text-primary">JD</span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex-1 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
                <Input id="firstName" defaultValue="John" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email Address</Label>
              <Input id="email" type="email" defaultValue="john@example.com" className="mt-1" disabled />
              <p className="text-xs text-muted-foreground mt-1">Managed by Clerk</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/50">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-primary text-primary-foreground">Save Changes</Button>
        </div>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border/50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

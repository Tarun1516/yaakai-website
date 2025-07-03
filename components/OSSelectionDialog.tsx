"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Monitor } from "lucide-react"

interface OSSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectOS: (osType: string) => void
}

// Simple Tux (Linux Penguin) SVG component
const LinuxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 260 300" // Adjusted viewBox for better fit if needed
    width="24" // Adjust size as needed
    height="24" // Adjust size as needed
    fill="currentColor"
    {...props}
  >
    <path d="M131.359,299.374c6.457,0,11.842-2.689,11.842-8.489V272.67c0-6.584-6.209-12.092-12.694-12.092h-1.407 c-6.484,0-12.694,5.508-12.694,12.092v18.215C116.406,296.685,124.902,299.374,131.359,299.374z" />
    <path d="M150.961,272.955c3.717,0,6.746-3.029,6.746-6.746s-3.029-6.746-6.746-6.746h-40.56c-3.717,0-6.746,3.029-6.746,6.746 s3.029,6.746,6.746,6.746H150.961z" />
    <path d="M129.999,0.626C61.26,0.626,5.002,51.362,5.002,113.039c0,16.364,4.015,32.828,11.995,47.459 c-0.102,0.25-0.201,0.502-0.302,0.753c-2.033,4.856-4.768,9.814-4.768,16.026c0,6.961,3.869,14.045,7.319,20.08 c0.758,1.326,1.665,2.533,2.698,3.612c-0.05,0.146-0.099,0.292-0.148,0.439c-2.053,6.229-3.102,12.991-3.102,20.121 c0,14.865,5.07,28.307,14.791,39.507c0.087,0.102,0.177,0.201,0.264,0.302c0.08,0.091,0.161,0.182,0.241,0.273 c-0.627,0.436-1.236,0.9-1.822,1.39c-9.816,8.075-16.042,19.859-16.042,33.379c0,23.992,21.87,43.518,48.751,43.518h0.02 c0.01,0,0.02,0,0.03,0h0.141c26.88,0,48.75-19.526,48.75-43.518c0-13.52-6.226-25.304-16.042-33.379 c-0.585-0.49-1.194-0.954-1.822-1.39c0.08-0.091,0.161-0.182,0.241-0.273c0.087-0.102,0.177-0.201,0.264-0.302 c9.721-11.2,14.791-24.642,14.791-39.507c0-7.129-1.049-13.891-3.102-20.121c-0.049-0.147-0.098-0.292-0.148-0.439 c1.033-1.08,1.94-2.286,2.698-3.612c3.45-6.035,7.319-13.119,7.319-20.08c0-6.212-2.734-11.17-4.768-16.026 c-0.102-0.25-0.201-0.502-0.302-0.753c7.98-14.63,11.995-31.095,11.995-47.459C255,51.362,198.738,0.626,129.999,0.626z M88.413,167.971c-11.045,0-19.999-8.954-19.999-19.999c0-11.046,8.954-19.999,19.999-19.999 c11.046,0,19.999,8.954,19.999,19.999C108.412,159.017,99.459,167.971,88.413,167.971z M171.588,167.971 c-11.046,0-19.999-8.954-19.999-19.999c0-11.046,8.954-19.999,19.999-19.999c11.045,0,19.999,8.954,19.999,19.999 C191.587,159.017,182.633,167.971,171.588,167.971z" />
  </svg>
)

export default function OSSelectionDialog({ open, onOpenChange, onSelectOS }: OSSelectionDialogProps) {
  const handleOSSelect = (osType: string) => {
    onSelectOS(osType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Select Operating System</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-blue-600">
                <Monitor size={24} />
              </div>
              <span className="text-lg font-medium">CheckBlock for Windows</span>
            </div>
            <Button
              onClick={() => handleOSSelect("Windows")}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-black">
                <LinuxIcon />
              </div>
              <span className="text-lg font-medium">CheckBlock for Linux</span>
            </div>
            <Button
              onClick={() => handleOSSelect("Linux")}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

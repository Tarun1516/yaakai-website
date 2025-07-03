"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Failed to send message. Please try again or contact us directly at yaakai1516@gmail.com.
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name" 
              className="w-full"
              required 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com" 
              className="w-full"
              required 
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <Input 
              id="subject" 
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subject" 
              className="w-full"
              required 
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message here..." 
              className="w-full" 
              rows={6}
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="bg-[#f59f0a] text-black border-2 border-black rounded-full px-6 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div className="mt-12 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="mb-2">Email: yaakai1516@gmail.com</p>
          <p className="mb-2">Location: Salem, Tamilnadu, India</p>
          <p>For enterprise inquiries, please contact: yaakai1516@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

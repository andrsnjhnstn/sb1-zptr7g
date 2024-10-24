import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

export function useWebhook() {
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState<string>("")

  useEffect(() => {
    const savedUrl = localStorage.getItem("webhookUrl")
    if (savedUrl) {
      setWebhookUrl(savedUrl)
    }
  }, [])

  const sendWebhook = async (data: any) => {
    if (!webhookUrl) return

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Webhook submission failed')
      }

      toast({
        title: "Webhook Notification",
        description: "Data successfully sent to webhook URL"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Webhook Error",
        description: "Failed to send data to webhook URL"
      })
      console.error('Webhook error:', error)
    }
  }

  return { webhookUrl, sendWebhook }
}
import { useState } from "react"

const DEFAULT_WEBHOOK_URL = "https://webhook-test.com/e10f12346aaf78f09ae6c8a25b50e133"
const DEFAULT_TIMEOUT = 10000

interface WebhookConfig {
  url?: string
  token?: string
  timeout?: number
}

interface WebhookResponse {
  success: boolean
  message: string
  details?: string
  statusCode?: number
}

export function useWebhook() {
  const [isLoading, setIsLoading] = useState(false)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const sendWebhook = async (data: any, config?: WebhookConfig): Promise<WebhookResponse> => {
    setIsLoading(true)
    
    try {
      const url = config?.url || DEFAULT_WEBHOOK_URL
      const timeout = config?.timeout || DEFAULT_TIMEOUT

      if (!validateUrl(url)) {
        throw new Error('Invalid webhook URL format')
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      if (config?.token) {
        headers['Authorization'] = `Bearer ${config.token}`
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: {
            ...data,
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId))

      let responseData: any = null
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        try {
          responseData = await response.json()
        } catch (e) {
          console.warn('Failed to parse JSON response:', e)
        }
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || 
          responseData?.error || 
          `Request failed with status: ${response.status}`
        )
      }

      return {
        success: true,
        message: 'Webhook sent successfully',
        details: responseData ? JSON.stringify(responseData, null, 2) : undefined,
        statusCode: response.status
      }
    } catch (error) {
      let errorMessage = 'Failed to send webhook'
      let details = ''

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out'
          details = 'The webhook request took too long to respond'
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error'
          details = 'Could not connect to the webhook URL. Please check your network connection and the URL'
        } else {
          errorMessage = error.message
          details = error.stack || ''
        }
      }

      console.error('Webhook error details:', {
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: errorMessage,
          details
        },
        timestamp: new Date().toISOString()
      })

      return {
        success: false,
        message: errorMessage,
        details
      }
    } finally {
      setIsLoading(false)
    }
  }

  const testWebhook = async (url?: string, token?: string): Promise<WebhookResponse> => {
    return sendWebhook(
      {
        type: "test",
        message: "This is a test webhook from LCAi",
        metadata: {
          environment: process.env.NODE_ENV,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
          testId: crypto.randomUUID()
        }
      },
      { url, token }
    )
  }

  return {
    isLoading,
    sendWebhook,
    testWebhook,
    validateUrl,
    defaultWebhookUrl: DEFAULT_WEBHOOK_URL
  }
}
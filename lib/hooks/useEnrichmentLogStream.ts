'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
  step?: string
  duration_ms?: number
  metadata?: Record<string, unknown>
}

export interface EnrichmentStreamStatus {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  error?: string
}

export function useEnrichmentLogStream(correlationId: string | null) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [status, setStatus] = useState<EnrichmentStreamStatus>({ status: 'disconnected' })
  const [percentComplete, setPercentComplete] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!correlationId) return

    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setStatus({ status: 'connecting' })

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const url = `${apiUrl}/api/v1/enrichment/logs/stream?correlationId=${correlationId}`

    try {
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setStatus({ status: 'connected' })
        reconnectAttempts.current = 0
      }

      eventSource.addEventListener('log', (event) => {
        try {
          const log = JSON.parse(event.data) as LogEntry
          setLogs((prev) => [...prev, log])
        } catch (e) {
          console.error('Failed to parse log event:', e)
        }
      })

      eventSource.addEventListener('status', (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.percent_complete !== undefined) {
            setPercentComplete(data.percent_complete)
          }
          if (data.status === 'completed' || data.status === 'failed') {
            setIsComplete(true)
          }
        } catch (e) {
          console.error('Failed to parse status event:', e)
        }
      })

      eventSource.addEventListener('complete', (event) => {
        setIsComplete(true)
        eventSource.close()
        setStatus({ status: 'disconnected' })
      })

      eventSource.addEventListener('error', (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data)
          setLogs((prev) => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'error',
            message: data.message || 'Unknown error occurred',
          }])
        } catch {
          // Not a data event, handle connection error
        }
      })

      eventSource.addEventListener('heartbeat', () => {
        // Keep-alive, no action needed
      })

      eventSource.onerror = () => {
        eventSource.close()
        setStatus({ status: 'error', error: 'Connection lost' })

        // Attempt reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts && !isComplete) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        }
      }
    } catch (error) {
      setStatus({ status: 'error', error: 'Failed to connect' })
    }
  }, [correlationId, isComplete])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setStatus({ status: 'disconnected' })
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  useEffect(() => {
    if (correlationId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [correlationId, connect, disconnect])

  return {
    logs,
    status,
    percentComplete,
    isComplete,
    connect,
    disconnect,
    clearLogs,
  }
}

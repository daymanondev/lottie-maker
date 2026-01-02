'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Bug, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  context?: 'canvas' | 'preview' | 'timeline' | 'generic'
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: boolean
}

const contextConfig = {
  canvas: {
    title: 'Canvas Error',
    description: 'Something went wrong with the canvas editor.',
    icon: AlertTriangle,
    retryText: 'Reset Canvas',
  },
  preview: {
    title: 'Preview Error',
    description: 'Failed to render animation preview.',
    icon: AlertTriangle,
    retryText: 'Retry Preview',
  },
  timeline: {
    title: 'Timeline Error',
    description: 'Something went wrong with the timeline.',
    icon: AlertTriangle,
    retryText: 'Reset Timeline',
  },
  generic: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred.',
    icon: Bug,
    retryText: 'Try Again',
  },
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error)
      console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    })
  }

  handleCopyError = async () => {
    const { error, errorInfo } = this.state
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`

    try {
      await navigator.clipboard.writeText(errorText)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch {
      console.error('Failed to copy error details')
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const context = this.props.context ?? 'generic'
      const config = contextConfig[context]
      const Icon = config.icon

      return (
        <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a] p-6">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border border-[#3f3f46] bg-[#141414] p-8 text-center shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <Icon className="h-7 w-7 text-red-500" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#fafafa]">{config.title}</h3>
              <p className="text-sm text-[#a1a1aa]">{config.description}</p>
            </div>

            {this.state.error && (
              <div className="w-full rounded-lg border border-[#3f3f46] bg-[#0a0a0a] p-3">
                <p className="break-all font-mono text-xs text-red-400">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#3f3f46] bg-[#1a1a1a] text-[#a1a1aa] hover:border-[#52525b] hover:bg-[#262626] hover:text-[#fafafa]"
                onClick={this.handleCopyError}
              >
                {this.state.copied ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy Error
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                onClick={this.handleReset}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                {config.retryText}
              </Button>
            </div>

            <p className="mt-2 text-xs text-[#52525b]">
              If this keeps happening, try refreshing the page.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function CanvasErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="canvas"
      onError={(error) => {
        console.error('[Canvas Error]', error.message)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function PreviewErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="preview"
      onError={(error) => {
        console.error('[Preview Error]', error.message)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function TimelineErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="timeline"
      onError={(error) => {
        console.error('[Timeline Error]', error.message)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

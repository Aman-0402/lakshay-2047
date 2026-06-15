'use client'

import { Component, ErrorInfo, ReactNode, Suspense } from 'react'

function GradientFallback() {
  return (
    <div
      className="w-full h-full"
      style={{
        background:
          'linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #1A1A25 100%)',
      }}
    />
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SceneWrapper] 3D render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

interface SceneWrapperProps {
  children: ReactNode
}

export default function SceneWrapper({ children }: SceneWrapperProps) {
  const fallback = <GradientFallback />
  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

"use client";

import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-6 text-center bg-white rounded-lg border border-red-100 my-4">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-stone-500 max-w-md mb-4">
            {this.state.error?.message || "An unexpected rendering error occurred. Please try refreshing."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-stone-900 text-stone-50 rounded-sm text-xs font-semibold hover:bg-stone-800 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

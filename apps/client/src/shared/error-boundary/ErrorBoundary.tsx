import { Component, ReactNode } from 'react';

export type ErrorBoundaryProps = {
  fallback: (onReset: () => void) => ReactNode;
  children: ReactNode;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  fallback: (onReset: () => void) => ReactNode;
  children: ReactNode;
  state: {
    hasError: boolean;
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.fallback = props.fallback;
    this.children = props.children;
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  resetError() {
    console.log('resetError');
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) return this.fallback(this.resetError.bind(this));
    return this.children;
  }
}

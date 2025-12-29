import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: 'red' }}>Something went wrong</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              Error Details (click to expand)
            </summary>
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
              <h3>Error Message:</h3>
              <pre style={{ color: 'red', overflow: 'auto' }}>{this.state.error?.toString()}</pre>
              
              <h3 style={{ marginTop: '20px' }}>Stack Trace:</h3>
              <pre style={{ overflow: 'auto', fontSize: '12px' }}>{this.state.error?.stack}</pre>
              
              {this.state.errorInfo && (
                <>
                  <h3 style={{ marginTop: '20px' }}>Component Stack:</h3>
                  <pre style={{ overflow: 'auto', fontSize: '12px' }}>{this.state.errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

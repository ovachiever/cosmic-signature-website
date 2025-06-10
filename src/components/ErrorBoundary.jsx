import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Error fallback UI
      return (
        <div style={{
          backgroundColor: '#1a1a2e',
          color: '#fff',
          padding: '40px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#f39c12', marginBottom: '20px' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ marginBottom: '20px' }}>
            We encountered an error while rendering the cosmic signature app.
          </p>
          {this.state.error && (
            <details style={{ 
              backgroundColor: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Error Details (for debugging)
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                fontSize: '12px',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#6b46c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

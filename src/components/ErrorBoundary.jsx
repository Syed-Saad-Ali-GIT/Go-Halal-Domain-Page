import React from 'react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to Sentry or other service
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
    
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Optionally refresh the component
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" style={{ 
          padding: '1rem', 
          margin: '1rem', 
          backgroundColor: '#FFF0F0', 
          borderRadius: '8px',
          border: '1px solid #FFD7D7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: this.props.fullHeight ? 'calc(100vh - 150px)' : 'auto'
        }}>
          <h3 style={{ color: '#E53935', marginBottom: '1rem' }}>
            {this.props.fallbackMessage || "Something went wrong"}
          </h3>
          <Button onClick={this.handleReset} style={{ marginTop: '1rem' }}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
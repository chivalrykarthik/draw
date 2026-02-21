import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary — catches render errors and shows a recovery UI
 * instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        background: '#020617',
                        color: '#f8fafc',
                        fontFamily: "'Inter', system-ui, sans-serif",
                        padding: '2rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            fontSize: '28px',
                        }}
                    >
                        ⚠️
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '400px', marginBottom: '1rem' }}>
                        D2 Draw encountered an unexpected error. You can try reloading the page or resetting the app state.
                    </p>
                    {this.state.error && (
                        <pre
                            style={{
                                background: '#0f172a',
                                border: '1px solid #1e293b',
                                borderRadius: '8px',
                                padding: '1rem',
                                fontSize: '0.75rem',
                                color: '#fb7185',
                                maxWidth: '600px',
                                overflow: 'auto',
                                marginBottom: '1.5rem',
                                textAlign: 'left',
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {this.state.error.message}
                        </pre>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                border: '1px solid #1e293b',
                                background: '#0f172a',
                                color: '#e2e8f0',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                        <button
                            onClick={this.handleReload}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                                color: '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

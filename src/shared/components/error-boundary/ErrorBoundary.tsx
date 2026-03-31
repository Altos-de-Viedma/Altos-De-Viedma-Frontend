import { Component, ErrorInfo, ReactNode } from 'react';
import { UI } from '../ui';
import { Icons } from '../ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <UI.Card className="w-full max-w-md shadow-lg">
            <UI.CardHeader className="flex flex-col items-center gap-4 pb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Icons.IoAlertCircleOutline
                  size={32}
                  className="text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Algo salió mal
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Ha ocurrido un error inesperado en la aplicación
                </p>
              </div>
            </UI.CardHeader>

            <UI.CardBody className="pt-0">
              <div className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="border border-gray-200 dark:border-gray-700 p-3 rounded-md text-xs">
                    <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                      Detalles del error (desarrollo)
                    </summary>
                    <pre className="mt-2 text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Intentar de nuevo
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Recargar página
                  </button>
                </div>
              </div>
            </UI.CardBody>
          </UI.Card>
        </div>
      );
    }

    return this.props.children;
  }
}
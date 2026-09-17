import { Component, type ErrorInfo, type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Folio crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            background: "#e8e2d6",
            color: "#1c1915",
          }}
        >
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Algo quebrou no Folio</h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
            Abra o console do navegador (F12) para detalhes. Pode limpar o localStorage e recarregar.
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#fffcf6",
              padding: 12,
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            type="button"
            style={{
              marginTop: 16,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: "#3d4a42",
              color: "#f7f3eb",
              cursor: "pointer",
            }}
            onClick={() => {
              try {
                localStorage.removeItem("folio-mvp");
              } catch {
                /* ignore */
              }
              window.location.href = "/identidade";
            }}
          >
            Limpar dados e recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Elemento #root não encontrado no HTML");
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);

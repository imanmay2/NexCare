
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorProvider } from "./components/ui/Error.tsx";

createRoot(document.getElementById("root")!).render(
  <ErrorProvider>
    <App />
  </ErrorProvider>
);

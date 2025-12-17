import { createRoot } from "react-dom/client";
import "../css/app.css";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";

function App() {
  const path = window.location.pathname;

  if (path === "/register") return <Registration />;
  if (path === "/dashboard") return <Dashboard />;

  return <Login />;
}

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(<App />);
}

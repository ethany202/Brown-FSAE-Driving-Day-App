import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Main from "./pages/Main";
// import Summary from "./pages/SummaryBellaTest";
import reportWebVitals from "./reportWebVitals";
import RunDetail from "./pages/RunDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RunSummary from "./pages/RunSummary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* Wrap your components with Router */}
      {/* <App /> Uncomment if App component is to be used */}
      <Main /> {/* Main component will be the entry point */}
      <Routes>
        <Route path="/run-summary" element={<RunSummary />} />
        <Route path="/run-detail" element={<RunDetail />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

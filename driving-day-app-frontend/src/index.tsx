import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

/**
 * Creates an object that handles routing for all webpages:
 *    EX: /home --> presents the <App/> page
 */
const router = createBrowserRouter([
  {
    path: "/",

    // TODO: Replace all elements with the desired webpage element
    element: <App />,
    children: [
      {
        path: "/home",
        element: <App />
      },
      {
        path: "/run-summary",
        element: <App />
      },
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RunsSummary from './pages/run-summary/RunSummary';
import RunDetail from './pages/run-page/RunDetail';
import Layout from './pages/layout/Layout';
import DriversPage from './pages/drivers-page/DriversPage';
import UploadFiles from './pages/upload-page/UploadFiles';
import Home from './pages/home-page/Home';
import MyAccount from './pages/account-page/MyAccount';
import DevPage from './pages/dev-page/DevPage';

/**
 * Creates an object that handles routing for all webpages:
 *    EX: /home --> presents the <App/> page
 */
const router = createBrowserRouter([
  {
    path: "/",

    // TODO: Replace all elements with the desired webpage element
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/run-data",
        element: <RunsSummary />
      },
      //TODO: Temporary path
      {
        path: "/runs/:runTitle",
        element: <RunDetail/>
      },
      {
        path: "/drivers",
        element: <DriversPage />
      },
      {
        path: "/my-account",
        element: <MyAccount />
      },
      {
        path: "/upload-files",
        element: <UploadFiles />
      }
    ]
  },
  {
    path: '/dev-page',
    element: <DevPage/>
  }
])

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);

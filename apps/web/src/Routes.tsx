import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { PageWrapper, UserGuard } from './components/layout';
import { Home, WaitingRoom } from './pages';
import { Room } from './pages/room';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserGuard>
        <PageWrapper />
      </UserGuard>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/waiting-room',
        element: <WaitingRoom />,
      },
      {
        path: '/room',
        element: <Room />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

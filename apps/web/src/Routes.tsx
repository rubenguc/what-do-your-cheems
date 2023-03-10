import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { Home, WaitingRoom, Room } from './pages';
import { PageWrapper } from './layout';
import { UserGuard } from './layout/UserGuard';

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

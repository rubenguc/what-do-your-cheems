import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home, WaitingRoom, Room } from './pages';
import { PageWrapper } from './layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
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
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

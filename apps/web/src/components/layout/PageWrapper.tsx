import { Outlet } from 'react-router-dom';

export const PageWrapper = () => {
  return (
    <div className='w-full max-w-7xl mx-auto h-full'>
      <Outlet />
    </div>
  );
};

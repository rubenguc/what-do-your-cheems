import { Outlet } from 'react-router-dom';

export const PageWrapper = () => {
  return (
    <div className='w-full max-w-7xl h-full'>
      <Outlet />
    </div>
  );
};

import { Outlet } from 'react-router-dom';
import { NotionLayout } from './NotionLayout';

const Layout = () => {
  return (
    <NotionLayout>
      <Outlet />
    </NotionLayout>
  );
};

export default Layout;

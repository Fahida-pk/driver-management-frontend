import Sidebar from "../pages/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-area">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

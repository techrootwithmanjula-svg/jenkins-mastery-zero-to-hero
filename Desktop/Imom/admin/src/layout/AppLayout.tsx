import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
<div className="min-h-screen overflow-hidden xl:flex">
  {/* Sidebar */}
  <div>
    <AppSidebar />
    <Backdrop />
  </div>

  {/* Main Content */}
  <div
    className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${
      isExpanded || isHovered
        ? "lg:ml-[290px]"
        : "lg:ml-[90px]"
    } ${isMobileOpen ? "ml-0" : ""}`}
  >
    <AppHeader />

    {/* Page Content */}
    <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
      <div className="mx-auto w-full min-w-0 max-w-screen-2xl">
        <Outlet />
      </div>
    </main>
  </div>
</div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;

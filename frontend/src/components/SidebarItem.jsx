import { NavLink } from "react-router-dom"; 

const SidebarItem = ({ icon, label, path }) => {
  return (
    <NavLink 
      to={path}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
        ${isActive 
          ? "bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600" // Styles when active
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900" // Styles when inactive
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem ;
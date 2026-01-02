import { Link } from "react-router-dom";
import { Palette, LogOut } from "lucide-react";

const AvatarComponent = ({ user, loading, logout }) => {
  return (
    <div className="absolute top-6 right-8 z-10">
      {loading ? (
        <div className="skeleton w-12 h-12 rounded-full"></div>
      ) : (
        <div className="dropdown dropdown-end dropdown-hover group">
          {/* Avatar */}
          <div 
            tabIndex={0} 
            role="button" 
            className="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-xl hover:shadow-lg transition-all cursor-pointer"
          >
            {user?.initial || "U"}
          </div>

          {/* Dropdown */}
          <ul 
            tabIndex={0} 
            className="dropdown-content z-[1] menu p-4 shadow-xl bg-base-100 rounded-2xl w-64 mt-2 border border-base-200"
          >
            {/* Expanded Avatar View */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-xl">
                {user?.initial || "U"}
              </div>
            </div>

            {/* Items */}
            <li className="mb-2">
              <Link to="/changetheme" className="btn btn-ghost rounded-full w-full font-normal justify-start pl-6">
                <Palette size={16} /> Change Theme
              </Link>
            </li>
            <li>
              <button 
                onClick={logout} 
                className="btn btn-ghost rounded-full w-full font-normal text-error justify-start pl-6"
              >
                <LogOut size={16} /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarComponent;


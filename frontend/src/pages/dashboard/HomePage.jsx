import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  LogOut
} from "lucide-react";
import toast from "react-hot-toast";
import SidebarItem from "../../components/SidebarItem";
import AvatarComponent from "../../components/AvatarComponent";
import {useAuthStore} from "../../store/useAuthStore";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true); 
  const { logout, authUser } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        if (authUser) {
          const initial = authUser.email ? authUser.email.charAt(0).toUpperCase() : "U";
          setUser({ 
            name: authUser.fullName || "User", 
            initial: initial 
          });
        }
      } catch (error) {
          toast.error("Failed to load profile ",error );
      } finally {
        setUserLoading(false);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [authUser]);


  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content flex flex-col">   

      {/*  Header */}
      <header className="h-16 border-b border-base-300 flex items-center justify-between px-6 bg-base-100 shrink-0 z-20">
        <h1 className="text-2xl italic font-medium text-primary">PrepMatrix</h1>
        
        <button className="btn btn-error text-white btn-sm rounded-full px-6" onClick={logout}>
          <LogOut className="size-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-base-100 border-r border-base-300 hidden md:flex flex-col py-6">
          <nav className="flex-1 space-y-1">
             <SidebarItem icon={<LayoutDashboard size={18}/>} label="Home" path="/" />
             <SidebarItem icon={<BookOpen size={18}/>} label="My Experiences" path="/myexperiences" />
             <SidebarItem icon={<PenTool size={18}/>} label="My Preparations" path="/mypreparations" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-base-100">
           
           <AvatarComponent user={user} loading={userLoading} logout={logout} />

           <div className="flex flex-col items-center justify-center min-h-[80vh]">
             
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-5xl text-base-content font-normal tracking-wide">What are we doing</h2>
                <h2 className="text-5xl text-base-content font-normal tracking-wide">today ?</h2>
              </div>

              {loading ? (
                 <div className="loading loading-dots loading-lg text-primary"></div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                  <div className="bg-base-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 hover:shadow-xl transition-shadow duration-300 min-h-[300px]">
                    <h3 className="text-2xl font-serif text-base-content/80">Share an experience ?</h3>
                    <Link to="/createexperience" className="btn btn-primary text-white px-8 h-12 rounded-full border-none capitalize text-base font-normal tracking-wide shadow-md w-full max-w-[200px]">
                      Yup ! Lets's do it !
                    </Link>
                  </div>

                  <div className="bg-base-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 hover:shadow-xl transition-shadow duration-300 min-h-[300px]">
                    <h3 className="text-2xl font-serif text-base-content/80">Prepare for an interview ?</h3>
                    <Link to="/createpreparation" className="btn btn-primary text-white px-8 h-12 rounded-full border-none capitalize text-base font-normal tracking-wide shadow-md w-full max-w-[220px]">
                      Yes ! Lets's break a leg
                    </Link>
                  </div>
                </div>
              )}
           </div>
        </main>

      </div>
    </div>
  );
};

export default HomePage;
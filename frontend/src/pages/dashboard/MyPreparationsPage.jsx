import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, Loader2, LayoutDashboard, BookOpen, PenTool, LogOut, FileText, Bot, Trash2, Calendar
} from "lucide-react";
import SidebarItem from "../../components/SidebarItem";
import AvatarComponent from "../../components/AvatarComponent";
import { useAuthStore } from "../../store/useAuthStore";
import { usePreparationStore } from "../../store/usePreparationStore";

const MyPreparationsPage = () => {
  const { preps, loading, fetchPreparations, deletePreparation } = usePreparationStore();
  const { logout, authUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); 

  useEffect(() => {
    const initPage = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      if (authUser) {
        const initial = authUser.email ? authUser.email.charAt(0).toUpperCase() : "U";
        setUser({ name: authUser.fullName || "User", initial });
      }

      setUserLoading(false);
      fetchPreparations();

    };

    initPage();
    
  }, [authUser, fetchPreparations]);

  const handleDelete = async (id, e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this preparation?")) return;

    setDeletingId(id);
    await deletePreparation(id);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content flex flex-col">
      <header className="h-16 border-b border-base-300 flex items-center justify-between px-6 bg-base-100 shrink-0 z-20">
        <h1 className="text-2xl italic font-medium text-primary">PrepMatrix</h1>
        <button className="btn btn-error text-white btn-sm rounded-full px-6" onClick={logout}>
          <LogOut className="size-5" /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-base-100 border-r border-base-300 hidden md:flex flex-col py-6">
          <nav className="flex-1 space-y-1">
             <SidebarItem icon={<LayoutDashboard size={18}/>} label="Home" path="/" />
             <SidebarItem icon={<BookOpen size={18}/>} label="My Experiences" path="/myexperiences" />
             <SidebarItem icon={<PenTool size={18}/>} label="My Preparations" path="/mypreparations" isActive={true} />
          </nav>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-base-100 relative">
           <AvatarComponent user={user} loading={userLoading} logout={logout} />

           <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 space-y-2">
                <h2 className="text-4xl md:text-5xl text-base-content font-normal tracking-wide">Your Preparations</h2>
              </div>

              {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary"/></div>
              ) : (
                 <div className="space-y-10">
                    {preps.length === 0 ? (
                       <div className="bg-base-200 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-base-300 flex flex-col items-center justify-center space-y-6">
                          <p className="text-xl text-base-content/60 font-serif">No preparations yet.</p>
                          <Link to="/createpreparation" className="btn btn-primary text-white px-8 rounded-full">Start a new prep</Link>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {preps.map((item) => {
                             const expLink = `/mypreparations/experiences?company=${encodeURIComponent(item.companyName)}&role=${encodeURIComponent(item.role)}${item.aiReviewId ? `&aiReviewId=${item.aiReviewId}` : ''}`;
                             return (
                                <div key={item._id} className="bg-base-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col min-h-[260px] relative group">
                                   <Link to={expLink} className="absolute inset-0 z-0 rounded-[2rem]" />

                                   <button onClick={(e) => handleDelete(item._id, e)} disabled={deletingId === item._id} className="absolute top-6 right-6 z-20 btn btn-circle btn-ghost btn-sm text-base-content/40 hover:text-error hover:bg-base-300 transition-all">
                                      {deletingId === item._id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={18} />}
                                   </button>

                                   <div className="space-y-4 flex-1 relative z-10 pointer-events-none">
                                      <div className="space-y-1 pr-8"> 
                                         <h3 className="text-2xl font-bold text-base-content capitalize truncate">{item.companyName}</h3>
                                         <div className="text-lg font-bold text-primary uppercase tracking-wide truncate">{item.role}</div>
                                      </div>
                                      <div className="divider my-2"></div>
                                      <div className="flex items-center gap-2 text-sm text-base-content/60"><Calendar size={14} /><span>Opened: {new Date(item.createdAt).toLocaleDateString()}</span></div>
                                   </div>

                                   <div className="mt-8 relative z-20 flex gap-3">
                                      <Link to={expLink} className="btn btn-primary btn-sm flex-[1.2] text-white rounded-full normal-case font-medium shadow-md"><FileText size={14} className="mr-1"/> Experiences</Link>
                                      {item.aiReviewId ? (
                                         <Link to={`/mypreparations/aireview/${item.aiReviewId}`} className="btn btn-neutral btn-sm flex-1 text-white rounded-full normal-case font-medium shadow-md"><Bot size={14} className="mr-1"/> AI Review</Link>
                                      ) : (
                                         <button disabled className="btn btn-disabled btn-sm flex-1 rounded-full normal-case font-medium opacity-50">AI Review</button>
                                      )}
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    )}
                    <div className="flex justify-center pt-8">
                       <Link to="/createpreparation" className="btn btn-outline text-base-content/70 hover:bg-base-200 hover:text-primary border-base-300 rounded-full gap-2 normal-case font-medium px-8 h-12"><Plus size={20} /> Add new</Link>
                    </div>
                 </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default MyPreparationsPage;
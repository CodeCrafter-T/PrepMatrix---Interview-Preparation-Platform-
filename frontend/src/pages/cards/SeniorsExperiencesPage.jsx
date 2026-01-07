import { useEffect, useState } from "react";
import { useSearchParams, Link} from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { 
  User, Calendar, ArrowRight, ArrowLeft, 
  FileQuestion, SearchX, BrainCircuit
} from "lucide-react";
import toast from "react-hot-toast";

const SeniorsExperiencesPage = () => {
  const [searchParams] = useSearchParams();
  // Get params from URL
  const companyQuery = searchParams.get("search") || searchParams.get("company") || "";
  const roleQuery = searchParams.get("role") || "";
  const urlAiReviewId = searchParams.get("aiReviewId"); 

  const [activeAiReviewId, setActiveAiReviewId] = useState(urlAiReviewId);

  // State
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        // Fetch Experiences
        if (companyQuery) {
            const expRes = await axiosInstance.get(`/experiences`, {
                params: { search: companyQuery }
            });
            setExperiences(expRes.data);
        } else {
            const expRes = await axiosInstance.get(`/experiences`);
            setExperiences(expRes.data);
        }

        // AI Review ID
        if (!urlAiReviewId && companyQuery && roleQuery) {
            try {
                // This call checks the DB first. If it exists, it returns the ID.
                const aiRes = await axiosInstance.post("/ai/generate", {
                    companyName: companyQuery,
                    role: roleQuery
                });
                
                if (aiRes.data?._id) {
                    setActiveAiReviewId(aiRes.data._id);
                }
            } catch (err) {
                console.error("Background check for AI Review failed:", err);
            }
        }
      } catch (error) {
        console.error("Error loading page data:", error);
        toast.error("Could not load experiences.");
      } finally {
        setLoading(false);
      }
    };

    initPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 

  return (
    <div className="min-h-screen bg-base-100 font-sans flex flex-col text-base-content">
      
      {/* Header */}
      <header className="h-20 border-b border-base-300 flex items-center justify-between px-8 bg-base-100 shrink-0 sticky top-0 z-20">
        <h1 className="text-3xl italic font-medium text-primary" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
          Prepare For An Interview
        </h1>
        
        <Link to="/mypreparations" className="btn btn-ghost btn-sm gap-2">
                   <ArrowLeft size={16}/> Back 
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-base-200 border-r border-base-300 hidden md:flex flex-col p-6 gap-2">
          
          <button className="btn btn-primary btn-sm justify-start gap-3 w-full shadow-md pointer-events-none">
            <User size={16}/> Seniors Experience
          </button>
          
          {/* Link to AI review */}
          <Link 
            to={activeAiReviewId ? `/mypreparations/aireview/${activeAiReviewId}` : "#"} 
            className={`btn btn-ghost btn-sm justify-start gap-3 w-full text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors ${!activeAiReviewId ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => !activeAiReviewId && e.preventDefault()}
          >
             <BrainCircuit size={16}/> AI Review
          </Link>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto bg-[#F3F4F6]">
          
          {/* Title */}
          {companyQuery && (
              <div className="max-w-4xl mx-auto mb-6">
                  <h2 className="text-4xl font-bold text-gray-800 capitalize">
                    Experiences at {companyQuery}
                  </h2>
              </div>
          )}

          {/* Results Grid */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : experiences.length === 0 ? (
              
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No experiences found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                  It looks like no seniors have shared their interview experience for this company yet.
                </p>
                
                <Link to="/createexperience" className="btn btn-outline btn-primary gap-2">
                   <FileQuestion size={18} />
                   Be the first to share
                </Link>
              </div>

            ) : (
              /* Cards */
              <div className="grid md:grid-cols-2 gap-6">
                {experiences.map((exp) => (
                  <div key={exp._id} className="card bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all group hover:border-primary/50 cursor-pointer">
                    <div className="card-body p-6">
                      
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="card-title text-xl text-gray-900 font-bold group-hover:text-primary transition-colors capitalize">
                            {exp.companyName}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 capitalize">
                            {exp.role}
                          </p>
                        </div>
                        <span className={`badge ${exp.overallToughness > 7 ? 'badge-error text-white' : 'badge-success text-white'} badge-sm font-bold`}>
                          Diff: {exp.overallToughness}/10
                        </span>
                      </div>

                      <div className="space-y-2 mt-4 text-xs font-medium text-gray-400 border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2">
                             <User size={14}/> 
                             <span> {exp.isAnonymous ? "Anonymous" : (exp.user?.name || exp.user?.email?.split('@')[0] || "Anonymous")} </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Calendar size={14}/> 
                             <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                          </div>
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <Link 
                          to={`/experience/${exp._id}`} 
                          className="btn btn-sm btn-ghost text-primary gap-1 hover:bg-primary/10"
                        >
                          Read Full Story <ArrowRight size={14}/>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeniorsExperiencesPage;
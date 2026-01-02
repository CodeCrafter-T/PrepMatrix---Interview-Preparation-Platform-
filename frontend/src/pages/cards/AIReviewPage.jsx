import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { 
  ArrowLeft, Building2, BrainCircuit, Code2, 
  Lightbulb, GraduationCap, CheckCircle2, Globe, Trophy,
  Sparkles, Briefcase, Quote 
} from "lucide-react";
import toast from "react-hot-toast";

const AIReviewPage = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIReview = async () => {
      try {
        const res = await axiosInstance.get(`/ai/${id}`);
        setReview(res.data);
      } catch (error) {
        console.error("Error fetching AI review:", error);
        toast.error("Failed to load the AI analysis.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAIReview();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!review) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
      <h2 className="text-2xl font-bold opacity-50">Review Not Found</h2>
      <Link to="/createpreparation" className="btn btn-primary">Create New Preparation</Link>
    </div>
  );

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
          <div className="font-bold text-base-content/40 text-xs uppercase tracking-wider mb-2">
            Navigation
          </div>
          
          {/* link to seniorsexperience page, passes company name AND the AI review ID */}
          <Link 
            to={`/mypreparations/experiences?search=${encodeURIComponent(review.companyName)}&role=${encodeURIComponent(review.role)}&aiReviewId=${review._id}`}
            className="btn btn-ghost btn-sm justify-start gap-3 w-full text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Building2 size={16}/> Seniors Experience
          </Link>

          <button className="btn btn-primary btn-sm justify-start gap-3 w-full pointer-events-none shadow-md">
            <BrainCircuit size={16}/> AI Review
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#F3F4F6]">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Company Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-400"></div>

              <div className="p-6 md:p-8">
                {/* Title & Badge */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                  <div className="flex gap-5 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={32} />
                    </div>
                    
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                        {review.companyName}
                      </h1>
                      
                      <div className="flex items-center gap-2 mt-1 text-gray-500 font-medium uppercase tracking-wide">
                         <Briefcase size={18} className="text-gray-400" />
                         {review.role}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-primary badge-lg gap-2 text-white shadow-lg shadow-primary/20 border-none py-4 px-4">
                     <Sparkles size={14} fill="currentColor" /> AI Generated Analysis
                  </span>
                </div>

                {/* Grid for Company motto & news */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Motto Card */}
                  <div className="relative group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                     <Quote className="absolute top-4 right-4 text-primary/10 w-10 h-10 group-hover:text-primary/20 transition-colors" />
                     <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2 relative z-10">
                        <Sparkles size={16} className="text-blue-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Philosophy</h3>
                     </div>
                     <p className="text-lg text-gray-700 font-serif italic leading-relaxed relative z-10 pl-2 border-l-2 border-primary/30">
                       "{review.companyMotto}"
                     </p>
                  </div>

                  {/* News Card */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                     <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                        <Briefcase size={16} className="text-blue-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Headlines</h3>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       {review.inTheNews}
                     </p>
                  </div>

                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              
              {/* Left Column- Tech & Coding  */}
              <div className="md:col-span-8 space-y-8">
                
                {/* Tech Stack Section */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-primary border-b pb-2">
                    <Code2 size={20}/> Technical Landscape
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Latest Tech */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <span className="text-xs font-bold text-green-700 uppercase">Current Stack</span>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                        {review.latestTechStack?.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    {/* Preferred Skills */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <span className="text-xs font-bold text-blue-700 uppercase">Key Skills</span>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                        {review.preferredSkills?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    {/* Past Tech Stack */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase">Legacy / Past</span>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-500">
                        {review.pastTechStack?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Coding Questions */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary border-b pb-2">
                    <CheckCircle2 size={20}/> Frequent Coding Problems
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                      <thead>
                        <tr className="text-gray-500">
                          <th>Problem Name</th>
                          <th>Frequency</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {review.codingQuestions?.map((q, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="font-medium text-gray-800">{q.problemName}</td>
                            <td>
                                <span className={`badge badge-sm ${q.frequency === 'High' ? 'badge-error text-white' : 'badge-ghost'}`}>
                                    {q.frequency}
                                </span>
                            </td>
                            <td className="text-right">
                              <a href={q.link} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline btn-primary">
                                Solve
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                 {/* MCQ Resources */}
                 <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary border-b pb-2">
                    <Globe size={20}/> Aptitude & MCQ Topics
                  </h3>
                  <div className="grid gap-4">
                    {review.mcqResources?.map((res, i) => (
                      <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <span className="font-bold text-sm text-gray-800 block">{res.topic}</span>
                            <span className="text-xs text-gray-500">{res.description}</span>
                        </div>
                        <a href={res.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline mt-2 md:mt-0">
                            View Resource →
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column- Tips & Insights */}
              <div className="md:col-span-4 space-y-8">
                 
                 {/* Tips */}
                 <section className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-xl border border-primary/10">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
                      <Lightbulb size={20}/> Insider Tips
                    </h3>
                    <ul className="space-y-4">
                      {review.tipsFromSeniors?.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-snug p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                          "{tip}"
                        </li>
                      ))}
                    </ul>
                 </section>

                 {/* Proud projects */}
                 <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
                      <Trophy size={20}/> Winning Projects
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Projects that impressed interviewers:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {review.mostProudProjects?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                 </section>

                 {/* Hired Profile Traits */}
                 <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
                      <GraduationCap size={20}/> Hired Profile Traits
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {review.hiredProfiles?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                 </section>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIReviewPage;
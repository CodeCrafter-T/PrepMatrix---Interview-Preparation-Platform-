import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Lightbulb, Code, Trophy, Hash, User, 
  CheckCircle, Briefcase, Edit, Trash2, Loader2
} from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const ExperiencePage = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); 
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        const res = await axiosInstance.get(`/experiences/${id}`);
        setExperience(res.data);
      } catch (error) {
        console.error("Error fetching experience:", error);
        toast.error("Could not load data");
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [id]);

  const toggleAnswer = (qId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Helper to extract unique topics from all rounds
  const getAllTopics = () => {
    if (!experience?.rounds) return [];
    const topics = new Set();
    experience.rounds.forEach(round => {
      round.topicsFocused?.forEach(topic => topics.add(topic));
    });
    return Array.from(topics);
  };

  // check authorization
  const isOwner = authUser && experience && (authUser._id === experience.user?._id || authUser._id === experience.user);

  // delete handle
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this experience? This action cannot be undone.")) return;

    setDeleting(true);
    try {
        await axiosInstance.delete(`/experiences/${id}`);
        toast.success("Experience deleted successfully");
        navigate("/myexperiences");
    } catch (error) {
        console.error("Error deleting experience:", error);
        toast.error("Failed to delete experience");
    } finally {
        setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!experience) return <div className="text-center p-10">Experience not found</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-gray-800 flex flex-col">
      

      <div className="flex flex-1 overflow-hidden">

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Back button */}
            <div className="flex justify-between items-center">
                <button onClick={() => navigate("/myexperiences")} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={18} /> Back
                </button>
                
                {/* action Buttons (Only for Owner) */}
                {isOwner && (
                    <div className="flex items-center gap-3">
                        {/* Delete Button */}
                        <button 
                            onClick={handleDelete}
                            disabled={deleting}
                            className="btn btn-outline btn-error btn-sm rounded-full px-4 gap-2 hover:text-white transition-colors"
                        >
                            {deleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                            <span className="hidden sm:inline">Delete</span>
                        </button>

                        {/* Edit Button */}
                        <Link 
                            to={`/updateexperience/${experience._id}`} 
                            className="btn btn-primary btn-sm rounded-full px-6 text-white shadow-lg shadow-blue-200 gap-2"
                        >
                            <Edit size={16} /> Edit Analysis
                        </Link>
                    </div>
                )}
            </div>

            {/* Header card - (Company Info) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Briefcase size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">{experience.companyName}</h1>
                            <div className="flex items-center gap-2 text-gray-500 mt-1 font-medium">
                                <Briefcase size={16}/> {experience.role}
                            </div>
                            <div className="flex items-center gap-2 mt-3 bg-gray-100 w-fit px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                                <User size={12} />
                                <span>Shared by: {experience.user?.name || "Anonymous User"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Box */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 min-w-[250px]">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">CTC Offered:</span>
                                <span className="font-semibold text-gray-900">{experience.ctcOffered || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Location:</span>
                                <span className="font-semibold text-gray-900">{experience.location || "Remote"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-semibold text-gray-900">{new Date(experience.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid layout for dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-600 mb-4">
                            <Code size={20} /> Technical Landscape
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Platforms */}
                            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
                                <h4 className="text-xs font-bold text-green-700 uppercase mb-3">Platforms Used</h4>
                                <ul className="space-y-1">
                                    {experience.platformsUsed && experience.platformsUsed.length > 0 ? (
                                        experience.platformsUsed.map((p, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {p}
                                            </li>
                                        ))
                                    ) : <li className="text-sm text-gray-400 italic">No platforms specified</li>}
                                </ul>
                            </div>

                            {/* Topics Focused */}
                            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">Key Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {getAllTopics().length > 0 ? (
                                        getAllTopics().map((topic, i) => (
                                            <span key={i} className="badge bg-white border border-blue-200 text-blue-700 text-xs font-semibold py-3">
                                                {topic}
                                            </span>
                                        ))
                                    ) : <span className="text-sm text-gray-400 italic">No specific topics listed</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-600">
                                <CheckCircle size={20} /> Interview Questions & Rounds
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
                                {experience.rounds?.length || 0} Rounds
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 border-b border-gray-100">Round / Problem Name</th>
                                        <th className="p-4 border-b border-gray-100">Details</th>
                                        <th className="p-4 border-b border-gray-100 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {experience.rounds?.map((round, rIndex) => (
                                        round.questions?.map((q, qIndex) => {
                                            const uniqueKey = `${rIndex}-${qIndex}`;
                                            return (
                                                <>
                                                    <tr key={uniqueKey} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="p-4 align-top">
                                                            <div className="font-semibold text-gray-800">{q.questionText}</div>
                                                            <div className="text-xs text-gray-400 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded">
                                                                {round.roundName}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex flex-col gap-1">
                                                                <span className={`text-xs font-bold px-2 py-1 rounded w-fit ${
                                                                    round.toughness >= 8 ? "bg-red-100 text-red-600" :
                                                                    round.toughness >= 5 ? "bg-orange-100 text-orange-600" :
                                                                    "bg-green-100 text-green-600"
                                                                }`}>
                                                                    Difficulty: {round.toughness}/10
                                                                </span>
                                                                <span className="text-xs text-gray-500">{round.duration || "N/A mins"}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-right">
                                                            {q.answerText ? (
                                                                <button 
                                                                    onClick={() => toggleAnswer(uniqueKey)}
                                                                    className="btn btn-outline btn-primary btn-xs rounded-full gap-1"
                                                                >
                                                                    {expandedAnswers[uniqueKey] ? "Hide" : "View Answer"}
                                                                </button>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">No Answer</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {/* Expanded Answer Row */}
                                                    {expandedAnswers[uniqueKey] && (
                                                        <tr className="bg-blue-50/20">
                                                            <td colSpan="3" className="p-4 text-sm text-gray-700 leading-relaxed border-l-4 border-blue-400">
                                                                <div className="font-bold text-blue-900 mb-1 text-xs uppercase">Candidate's Answer / Approach:</div>
                                                                {q.answerText}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })
                                    ))}
                                </tbody>
                            </table>
                            {(!experience.rounds || experience.rounds.length === 0) && (
                                <div className="p-8 text-center text-gray-400 italic">No rounds detailed.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column - Sidebar */}
                <div className="space-y-6">
                    
                    {/* Insider Tips */}
                    <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-yellow-700 mb-4">
                            <Lightbulb size={20} /> Insider Tips
                        </h3>
                        {experience.tips ? (
                            <div className="bg-white rounded-lg p-4 border border-yellow-100 text-sm text-gray-700 italic leading-relaxed shadow-sm">
                                "{experience.tips}"
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No tips provided.</p>
                        )}
                    </div>

                    {/* Overall Toughness */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                            <Trophy size={20} className="text-orange-500" /> Overall Rating
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Toughness</span>
                                    <span className="font-bold text-gray-900">{experience.overallToughness}/10</span>
                                </div>
                                <progress 
                                    className={`progress w-full ${
                                        experience.overallToughness > 7 ? "progress-error" : 
                                        experience.overallToughness > 4 ? "progress-warning" : "progress-success"
                                    }`} 
                                    value={experience.overallToughness} 
                                    max="10"
                                ></progress>
                            </div>
                        </div>
                    </div>

                    {/* Overall Experience */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                            <Hash size={20} className="text-purple-500" /> Summary
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {experience.overallExperience || "No summary provided."}
                        </p>
                    </div>

                </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExperiencePage;
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { 
  Plus, Trash2, Save, ArrowLeft, Loader2, Briefcase, 
  Layers, HelpCircle, CheckCircle, LogOut, LayoutDashboard, BookOpen, PenTool 
} from "lucide-react";
import toast from "react-hot-toast";
import SidebarItem from "../../components/SidebarItem";
import { useAuthStore } from "../../store/useAuthStore";

const CreateExperiencePage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const isEditMode = !!id; 
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [deleting, setDeleting] = useState(false);

  // Initial Form State
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    ctcOffered: "",
    location: "",
    overallToughness: 5,
    platformsUsed: "", 
    tips: "",
    overallExperience: "",
    rounds: [
      {
        roundName: "Round 1",
        duration: "45 mins",
        toughness: 5,
        topicsFocused: "",
        questions: [{ questionText: "", answerText: "" }]
      }
    ]
  });

  // Fetch and populate
  useEffect(() => {
    if (isEditMode) {
      const fetchExperience = async () => {
        try {
          const res = await axiosInstance.get(`/experiences/${id}`);
          const data = res.data;

          // Auth check
          const ownerId = data.user?._id || data.user;
          if (authUser._id !== ownerId) {
             toast.error("You are not authorized to edit this experience.");
             navigate("/");
             return;
          }
          
          setFormData({
            ...data,
            platformsUsed: data.platformsUsed ? data.platformsUsed.join(", ") : "",
            rounds: data.rounds.map(round => ({
              ...round,
              topicsFocused: round.topicsFocused ? round.topicsFocused.join(", ") : ""
            }))
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Could not load experience data");
          navigate("/myexperiences");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchExperience();
    }
  }, [id, isEditMode, authUser, navigate]);

  // Form Handlers

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index][field] = value;
    setFormData({ ...formData, rounds: newRounds });
  };

  const handleQuestionChange = (roundIndex, qIndex, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[roundIndex].questions[qIndex][field] = value;
    setFormData({ ...formData, rounds: newRounds });
  };

  const addRound = () => {
    setFormData({
      ...formData,
      rounds: [
        ...formData.rounds, 
        { 
            roundName: `Round ${formData.rounds.length + 1}`, 
            duration: "", 
            toughness: 5, 
            topicsFocused: "", 
            questions: [{ questionText: "", answerText: "" }] 
        }
      ]
    });
  };

  const removeRound = (index) => {
    const newRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData({ ...formData, rounds: newRounds });
  };

  const addQuestion = (roundIndex) => {
    const newRounds = [...formData.rounds];
    newRounds[roundIndex].questions.push({ questionText: "", answerText: "" });
    setFormData({ ...formData, rounds: newRounds });
  };

  const removeQuestion = (roundIndex, qIndex) => {
    const newRounds = [...formData.rounds];
    newRounds[roundIndex].questions = newRounds[roundIndex].questions.filter((_, i) => i !== qIndex);
    setFormData({ ...formData, rounds: newRounds });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this experience? This cannot be undone.")) return;
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        numberOfRounds: formData.rounds.length,
        platformsUsed: formData.platformsUsed.split(",").map(s => s.trim()).filter(Boolean),
        rounds: formData.rounds.map(round => ({
          ...round,
          topicsFocused: round.topicsFocused.split(",").map(s => s.trim()).filter(Boolean),
          toughness: Number(round.toughness)
        }))
      };

      if (isEditMode) {
        await axiosInstance.put(`/experiences/${id}`, payload);
        toast.success("Experience updated successfully!");
        navigate(`/experience/${id}`); 
      } else {
        await axiosInstance.post("/experiences", payload);
        toast.success("Experience shared successfully!");
        navigate("/myexperiences");
      }

    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <Loader2 className="animate-spin text-primary size-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content flex flex-col">
      


      <div className="flex flex-1 overflow-hidden">

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-base-200/50">
          <div className="max-w-4xl mx-auto">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-base-content">
                      {isEditMode ? "Update Experience" : "Share Experience"}
                    </h1>
                    <p className="text-base-content/60">
                      {isEditMode ? "Refine your analysis." : "Help others ace their interviews."}
                    </p>
                  </div>
               </div>
               
               {/* Delete */}
               {isEditMode && (
                  <button 
                     type="button" 
                     onClick={handleDelete} 
                     disabled={deleting}
                     className="btn btn-outline btn-error btn-sm rounded-full gap-2"
                  >
                     {deleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                     Delete
                  </button>
               )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Info */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <h3 className="card-title text-primary flex items-center gap-2 mb-4">
                    <Briefcase size={20} /> Company Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Company Name</span></label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Role Applied For</span></label>
                      <input type="text" name="role" value={formData.role} onChange={handleInputChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">CTC Offered</span></label>
                      <input type="text" name="ctcOffered" value={formData.ctcOffered} onChange={handleInputChange} className="input input-bordered w-full" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Location</span></label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input input-bordered w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Overall Toughness (1-10)</span></label>
                      <input type="range" name="overallToughness" min="1" max="10" value={formData.overallToughness} onChange={handleInputChange} className="range range-primary range-sm" />
                      <div className="w-full flex justify-between text-xs px-2 mt-2"><span>Easy</span><span>Mid</span><span>Hard</span></div>
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text font-medium">Platforms Used</span></label>
                      <input type="text" name="platformsUsed" value={formData.platformsUsed} onChange={handleInputChange} placeholder="Comma separated (e.g. LeetCode, HackerRank)" className="input input-bordered w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rounds */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Layers size={20} className="text-primary"/> Interview Rounds</h3>
                    <button type="button" onClick={addRound} className="btn btn-sm btn-outline btn-primary gap-2"><Plus size={16} /> Add Round</button>
                 </div>
                 
                 {formData.rounds.map((round, rIndex) => (
                    <div key={rIndex} className="card bg-base-100 shadow-sm border border-base-200">
                       <div className="card-body p-6">
                          <div className="flex justify-between items-start mb-4 pb-4 border-b border-base-200">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mr-4">
                                <input type="text" value={round.roundName} onChange={(e) => handleRoundChange(rIndex, 'roundName', e.target.value)} placeholder="Round Name" className="input input-bordered input-sm font-bold w-full" />
                                <input type="text" value={round.duration} onChange={(e) => handleRoundChange(rIndex, 'duration', e.target.value)} placeholder="Duration" className="input input-bordered input-sm w-full" />
                             </div>
                             <button type="button" onClick={() => removeRound(rIndex)} className="btn btn-ghost btn-xs text-error"><Trash2 size={16} /></button>
                          </div>
                          
                          <div className="form-control mb-4">
                             <label className="label pt-0"><span className="label-text text-xs font-medium">Topics Focused</span></label>
                             <input type="text" value={round.topicsFocused} onChange={(e) => handleRoundChange(rIndex, 'topicsFocused', e.target.value)} placeholder="Comma separated (e.g. DP, Graphs, OS)" className="input input-bordered input-sm w-full" />
                          </div>

                          <div className="bg-base-200/50 rounded-xl p-4">
                             <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><HelpCircle size={14}/> Questions Asked</h4>
                             <div className="space-y-3">
                                {round.questions.map((q, qIndex) => (
                                   <div key={qIndex} className="flex gap-2 items-start">
                                      <div className="flex-1 space-y-2">
                                         <input type="text" value={q.questionText} onChange={(e) => handleQuestionChange(rIndex, qIndex, 'questionText', e.target.value)} placeholder="Question / Problem Statement" className="input input-bordered input-sm w-full bg-white" required />
                                         <textarea value={q.answerText} onChange={(e) => handleQuestionChange(rIndex, qIndex, 'answerText', e.target.value)} placeholder="Your Answer / Approach (Optional)" className="textarea textarea-bordered textarea-xs w-full bg-white h-16" />
                                      </div>
                                      <button type="button" onClick={() => removeQuestion(rIndex, qIndex)} className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error mt-1"><Trash2 size={14} /></button>
                                   </div>
                                ))}
                             </div>
                             <button type="button" onClick={() => addQuestion(rIndex)} className="btn btn-ghost btn-xs text-primary mt-3 gap-1"><Plus size={12} /> Add Question</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Summary */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <h3 className="card-title text-primary flex items-center gap-2 mb-4"><CheckCircle size={20} /> Final Thoughts</h3>
                  <div className="form-control">
                     <label className="label"><span className="label-text font-medium">Insider Tips</span></label>
                     <textarea name="tips" value={formData.tips} onChange={handleInputChange} className="textarea textarea-bordered h-24" placeholder="Share some advice for future candidates..."></textarea>
                  </div>
                  <div className="form-control mt-4">
                     <label className="label"><span className="label-text font-medium">Overall Experience</span></label>
                     <textarea name="overallExperience" value={formData.overallExperience} onChange={handleInputChange} className="textarea textarea-bordered h-24" placeholder="How was the overall process? Any other thoughts?"></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pb-10">
                 <button type="submit" className="btn btn-primary rounded-full px-8 gap-2 text-white shadow-lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isEditMode ? "Update Experience" : "Publish Experience"}
                 </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateExperiencePage;
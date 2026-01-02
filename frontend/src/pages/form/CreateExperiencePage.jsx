import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios"; 
import {
  Building2, MapPin, IndianRupee,
  BrainCircuit, Target, Plus, Trash2, Save,
  Clock, Ghost, Calendar, BarChart3, ArrowLeft, LogOut
} from "lucide-react";
import toast from "react-hot-toast";

const CreateExperiencePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Initial State
  const [formData, setFormData] = useState(() => ({
    companyName: "",
    role: "",
    ctcOffered: "",
    location: "",
    overallToughness: 5,
    platformsUsed: "", 
    rounds: [
      {
        id: "round-1",
        roundName: "Round 1",
        dateAttempted: "",
        duration: "",
        toughness: 5,
        topicsFocused: "", 
        questions: [{ id: "q-1", questionText: "", answerText: "" }]
      }
    ],
    tips: "",
    overallExperience: "",
    isAnonymous: false,
  }));

  // Handlers

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [
        ...prev.rounds,
        {
          id: crypto.randomUUID(),
          roundName: `Round ${prev.rounds.length + 1}`,
          dateAttempted: "",
          duration: "",
          toughness: 5,
          topicsFocused: "",
          questions: [{ id: crypto.randomUUID(), questionText: "", answerText: "" }]
        }
      ]
    }));
  };

  const removeRound = (index) => {
    if (formData.rounds.length === 1) return toast.error("At least one round is required.");
    const newRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index][field] = value;
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const addQuestion = (roundIndex) => {
    const newRounds = [...formData.rounds];
    newRounds[roundIndex].questions.push({ id: crypto.randomUUID(), questionText: "", answerText: "" });
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const removeQuestion = (roundIndex, qIndex) => {
    const newRounds = [...formData.rounds];
    if (newRounds[roundIndex].questions.length === 1) return;
    newRounds[roundIndex].questions = newRounds[roundIndex].questions.filter((_, i) => i !== qIndex);
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const handleQuestionChange = (roundIndex, qIndex, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[roundIndex].questions[qIndex][field] = value;
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  // Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.companyName || !formData.role) return toast.error("Company and Role are required");

    setLoading(true);

    try {
      const payload = {
        ...formData,
        platformsUsed: formData.platformsUsed 
          ? formData.platformsUsed.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        
        rounds: formData.rounds.map(round => ({
          ...round,
          topicsFocused: round.topicsFocused 
            ? round.topicsFocused.split(",").map(s => s.trim()).filter(Boolean)
            : [],
          toughness: Number(round.toughness),
          questions: round.questions.filter(q => q.questionText.trim() !== "")
        }))
      };

      console.log("Submitting Payload:", payload);

      // send to backend
      await axiosInstance.post("/experiences", payload);
      
      toast.success("Experience Shared Successfully!");
      navigate('/myexperiences');

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Failed to share experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans flex flex-col text-base-content">

      {/* Header */}
      <header className="h-20 border-b border-base-300 flex items-center justify-between px-8 bg-base-100 shrink-0 z-20 sticky top-0">
        <h1 className="text-4xl italic font-medium text-primary">Share Your Experience</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <Link
              to="/myexperiences"
              className="btn bg-base-200 hover:bg-base-300 text-base-content border-none rounded-full px-8 gap-2 normal-case font-medium transition-all hover:gap-3 shadow-sm w-full lg:w-auto justify-center lg:justify-start"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>

          <div className="lg:col-span-8 w-full">
            
            <div className="w-full max-w-4xl mx-auto bg-base-200 p-8 rounded-2xl shadow-inner border border-base-300">
                
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basics */}
                <div className="bg-base-100 p-8 rounded-xl shadow-sm border border-base-300 space-y-6">
                  <h2 className="text-lg font-bold flex items-center gap-2 border-b border-base-300 pb-3 text-base-content">
                    <Building2 size={20} className="text-primary"/> Company Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label text-sm font-medium text-base-content/70">Company Name *</label>
                      <input type="text" name="companyName" required className="input input-bordered w-full focus:input-primary bg-base-200/50" placeholder="e.g. Microsoft" value={formData.companyName} onChange={handleBasicChange}/>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium text-base-content/70">Role Applied *</label>
                      <input type="text" name="role" required className="input input-bordered w-full focus:input-primary bg-base-200/50" placeholder="e.g. Software Engineer" value={formData.role} onChange={handleBasicChange}/>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium text-base-content/70">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-base-content/50 w-4 h-4"/>
                        <input type="text" name="location" className="input input-bordered w-full pl-9 focus:input-primary bg-base-200/50" placeholder="e.g. Hyderabad" value={formData.location} onChange={handleBasicChange}/>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label text-sm font-medium text-base-content/70">CTC Offered</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-3.5 text-base-content/50 w-4 h-4"/>
                        <input type="text" name="ctcOffered" className="input input-bordered w-full pl-9 focus:input-primary bg-base-200/50" placeholder="e.g. 18 LPA" value={formData.ctcOffered} onChange={handleBasicChange}/>
                      </div>
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label text-sm font-medium text-base-content/70">Platforms Used *</label>
                      <div className="relative">
                        <BrainCircuit className="absolute left-3 top-3.5 text-base-content/50 w-4 h-4"/>
                        <input type="text" name="platformsUsed" className="input input-bordered w-full pl-9 focus:input-primary bg-base-200/50" placeholder="e.g. HackerRank, Meet" value={formData.platformsUsed} onChange={handleBasicChange}/>
                      </div>
                    </div>

                    {/* Overall Toughness */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Overall Process Difficulty</span>
                        <span className="label-text-alt font-bold text-primary">{formData.overallToughness}/10</span>
                      </label>

                      <input 
                        type="range" 
                        name="overallToughness"
                        min="1" 
                        max="10" 
                        value={formData.overallToughness} 
                        onChange={handleBasicChange}
                        className="range range-primary range-sm" 
                      />

                      <div className="w-full flex justify-between text-xs px-2 mt-1 opacity-50">
                        <span>Easy</span>
                        <span>Medium</span>
                        <span>Hard</span>
                        <span>Insane</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Rounds */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-base-content">
                      <Target size={22} className="text-primary"/> Interview Rounds
                    </h2>
                    <button type="button" onClick={addRound} className="btn btn-sm btn-primary btn-outline gap-2 shadow-sm">
                      <Plus size={16}/> Add Round
                    </button>
                  </div>

                  {formData.rounds.map((round, rIndex) => (
                    <div key={round.id} className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                      {/* Round Header Bar */}
                      <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex justify-between items-center">
                        <div className="flex items-center gap-3 w-full max-w-md">
                          <input
                            type="text"
                            className="input input-ghost input-sm w-full font-bold focus:bg-base-100 text-lg"
                            value={round.roundName}
                            onChange={(e) => handleRoundChange(rIndex, 'roundName', e.target.value)}
                          />
                        </div>
                        {formData.rounds.length > 1 && (
                          <button type="button" onClick={() => removeRound(rIndex)} className="text-base-content/40 hover:text-error transition-colors p-2">
                            <Trash2 size={18}/>
                          </button>
                        )}
                      </div>

                      {/* Round Content */}
                      <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-1 gap-6">
                          <div className="grid md:grid-cols-2 gap-6">
                          <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/50 uppercase">Date Attempted</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 text-base-content/50 w-4 h-4"/>
                              <input
                                type="date"
                                className="input input-bordered input-sm w-full pl-9 bg-base-200/30"
                                value={round.dateAttempted}
                                onChange={(e) => handleRoundChange(rIndex, 'dateAttempted', e.target.value)}
                              />
                            </div>
                          </div>


                          {/* Duration */}
                          <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/50 uppercase">Duration</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 text-base-content/50 w-4 h-4"/>
                              <input type="text" className="input input-bordered input-sm w-full pl-9 bg-base-200/30" placeholder="45 mins" value={round.duration} onChange={(e) => handleRoundChange(rIndex, 'duration', e.target.value)}/>
                            </div>
                          </div>
                          </div>

                          {/* Topics */}
                          <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/50 uppercase">Focus Topics *</label>
                            <input type="text" className="input input-bordered input-sm w-full bg-base-200/30" placeholder="DP, OS, Networking" value={round.topicsFocused} onChange={(e) => handleRoundChange(rIndex, 'topicsFocused', e.target.value)}/>
                          </div>
                          
                          {/* Round Toughness */}
                          <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/50 uppercase flex justify-between">
                              <span>Difficulty</span>
                              <span className="text-primary">{round.toughness}/10</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="text-base-content/50 w-4 h-4"/>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                className="range range-xs range-primary"
                                value={round.toughness}
                                onChange={(e) => handleRoundChange(rIndex, 'toughness', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                  {/* Questions Section */}
                  <div className="bg-base-200/50 rounded-xl p-4">
                    <label className="label font-medium text-sm text-base-content/70">Questions asked in this round *</label>
                    
                    {round.questions.map((q, qIndex) => (
                      <div key={qIndex} className="mb-4 last:mb-0 group relative">
                        <div className="flex gap-4">
                           <span className="pt-3 font-mono text-sm opacity-50">Q{qIndex + 1}</span>
                           <div className="flex-1 space-y-2">
                             <input 
                                type="text" 
                                placeholder="What was the question?" 
                                className="input input-bordered w-full input-sm"
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(rIndex, qIndex, 'questionText', e.target.value)}
                             />
                             <textarea 
                                placeholder="Brief answer or approach used..." 
                                className="textarea textarea-bordered w-full text-sm h-20"
                                value={q.answerText}
                                onChange={(e) => handleQuestionChange(rIndex, qIndex, 'answerText', e.target.value)}
                             ></textarea>
                           </div>
                        </div>
                        
                        {/* Remove Question X button */}
                        {round.questions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeQuestion(rIndex, qIndex)}
                            className="absolute -right-2 -top-2 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button type="button" onClick={() => addQuestion(rIndex)} className="btn btn-ghost btn-xs w-full mt-2 text-primary border-dashed border border-primary/30">
                      <Plus size={14} /> Add Another Question
                    </button>
                  </div>
                      </div>
                    </div>
                  ))}
                </div>

          {/* Final Details */}
          <div className="card bg-base-200 p-6 space-y-4">
             <div className="form-control">
                <label className="label"><span className="label-text font-bold">Overall Experience & Verdict</span></label>
                <textarea 
                  name="overallExperience"
                  className="textarea textarea-bordered h-32" 
                  placeholder="How was the interviewer? Was the process smooth? Did you get selected?"
                  value={formData.overallExperience}
                  onChange={handleBasicChange}
                ></textarea>
             </div>

             <div className="form-control">
                <label className="label"><span className="label-text font-bold">Tips for Juniors</span></label>
                <textarea 
                  name="tips"
                  className="textarea textarea-bordered h-24" 
                  placeholder="Focus on Graphs, Be confident, etc."
                  value={formData.tips}
                  onChange={handleBasicChange}
                ></textarea>
             </div>

             <div className="form-control">
               <label className="label cursor-pointer justify-start gap-4">
                 <input 
                    type="checkbox" 
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleBasicChange}
                    className="checkbox checkbox-primary" 
                 />
                 <div className="flex items-center gap-2">
                    <Ghost size={18} />
                    <span className="label-text font-medium">Post Anonymously</span>
                 </div>
               </label>
               <p className="text-xs text-base-content/60 ml-9 mt-1">Your name will be hidden from the public view.</p>
             </div>
          </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg text-lg rounded-xl shadow-lg hover:shadow-primary/25">
              {loading ? <span className="loading loading-spinner"></span> : <><Save size={20}/> Submit Experience</>}
            </button>

              </form>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2"></div>

        </div>
      </div>
    </div>
  );
};

export default CreateExperiencePage;
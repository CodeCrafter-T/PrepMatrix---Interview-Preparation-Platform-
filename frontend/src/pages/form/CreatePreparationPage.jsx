import { useState} from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios"; 
import {
  Building2, Briefcase, Hash,
  Search, ArrowLeft, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

const CreatePreparationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [formData, setFormData] = useState({
    companyName: searchParams.get("prefillCompany") || "",
    role: searchParams.get("prefillRole") || "",
    jobCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateAIReviewInBackground = async () => {
    try {
        const res = await axiosInstance.post("/ai/generate", {
            companyName: formData.companyName,
            role: formData.role,
            jobCode: formData.jobCode 
        });
        return res.data._id;
    } catch (error) {
        console.error("Background AI Gen failed:", error);
        return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() && !formData.role.trim()) {
      return toast.error("Please enter a Company or Role to start searching.");
    }
    
    setLoadingSearch(true);
    const toastId = toast.loading("Setting up your dashboard...");

    try {
      const aiReviewId = await generateAIReviewInBackground();
      await axiosInstance.post("/preparations", {
        companyName: formData.companyName,
        role: formData.role, 
        type: "Search",
        aiReviewId: aiReviewId
      });

      const params = new URLSearchParams();
      if (formData.companyName) params.append("search", formData.companyName);
      if (formData.role) params.append("role", formData.role);

      if (aiReviewId) params.append("aiReviewId", aiReviewId);

      toast.success("Ready!", { id: toastId });
      navigate(`/mypreparations/experiences?${params.toString()}`);

    } catch (error) {
      console.error("Search Prep Error:", error);
      toast.error("Search Prep Error");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    
    if (!formData.companyName.trim() || !formData.role.trim()) {
      return toast.error("Company Name and Role are required.");
    }

    setLoadingAI(true);
    const toastId = toast.loading("Generating deep research... (Takes ~10s)");

    try {
      const aiRes = await axiosInstance.post("/ai/generate", {
        companyName: formData.companyName,
        role: formData.role,
        jobCode: formData.jobCode 
      });


      await axiosInstance.post("/preparations", {
        companyName: formData.companyName,
        role: formData.role,
        type: "AI Review",
        aiReviewId: aiRes.data._id 
      });

      toast.success("Research Complete!", { id: toastId });
      
      if (aiRes?.data?._id) {
        navigate(`/mypreparations/aireview/${aiRes.data._id}`);
      } else {
         toast.error("Error: No ID returned");
      }

    } catch (error) {
      console.error("AI Gen Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to generate review.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans flex flex-col text-base-content">
      
      {/* Header */}
      <header className="h-20 border-b border-base-300 flex items-center justify-between px-8 bg-base-100 shrink-0 z-20 sticky top-0">
        <h1 className="text-3xl md:text-4xl italic font-medium text-primary" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
          Prepare For An Interview
        </h1>
      </header>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Back */}
          <div className="lg:col-span-2 lg:sticky lg:top-15">
            <Link
              to="/mypreparations"
              className="btn bg-[#E5E7EB] hover:bg-[#D1D5DB] text-black border-none rounded-full px-8 gap-2 normal-case font-medium transition-all hover:gap-3 shadow-sm w-full lg:w-auto justify-center lg:justify-start"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-8 w-full">
            <div className="w-full max-w-3xl mx-auto bg-[#E5E7EB] p-8 rounded-2xl shadow-sm border border-[#D1D5DB] space-y-8">
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">
                  Let's set up your prep.
                </h2>
                <p className="text-gray-600">
                  Tell us what you're aiming for, and choose your path below.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] grid gap-6">
                
                {/* Company Name */}
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-700">
                    Company Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="companyName"
                      className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                      placeholder="e.g. Google, Microsoft"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-700">
                    Role <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="role" 
                      className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                      placeholder="e.g. SDE, Frontend Engineer"
                      value={formData.role}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Job Code */}
                  <div className="form-control">
                    <label className="label text-sm font-medium text-gray-700">
                      Job Code (Optional)
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="jobCode"
                        className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                        placeholder="e.g. 12345"
                        value={formData.jobCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-300">
                
                {/* Search Experiences */}
                <button
                  onClick={handleSearch}
                  disabled={loadingSearch || loadingAI}
                  className="btn btn-outline btn-primary flex-1 gap-2 text-lg normal-case rounded-xl font-medium border-2 hover:bg-primary hover:text-white transition-all"
                >
                  {loadingSearch ? <span className="loading loading-spinner"></span> : <Search size={20} />}
                  Search Experiences
                </button>

                {/* Generate AI Review */}
                <button
                  onClick={handleGenerateAI}
                  disabled={loadingSearch || loadingAI}
                  className="btn btn-primary flex-1 gap-2 text-lg normal-case rounded-xl shadow-lg hover:shadow-primary/30 font-medium text-white transition-all"
                >
                  {loadingAI ? (
                    <span className="loading loading-spinner text-white"></span>
                  ) : (
                    <>
                      <Sparkles size={20} /> Generate AI Review
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default CreatePreparationPage;
import { THEMES } from "../../constants";
import { useThemeStore } from "../../store/useThemeStore";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

const ChangeThemePage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">

      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="btn btn-ghost gap-2 pl-0 text-base-content/70 hover:text-primary hover:bg-transparent transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </Link>
      </div>

      {/* Main content*/}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-4xl mx-auto">
              
              {/* MOCK DASHBOARD UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300 flex flex-col h-[400px]">
                
                {/* 1. Mock Header */}
                <div className="h-12 border-b border-base-300 flex items-center justify-between px-4 bg-base-100 shrink-0">
                   <div className="text-lg italic font-bold text-primary">PrepMatrix</div>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm">U</div>
                   </div>
                </div>

                {/* 2. Mock Body */}
                <div className="flex flex-1 overflow-hidden">
                  
                  {/* Mock Sidebar */}
                  <div className="w-48 bg-base-100 border-r border-base-300 hidden md:flex flex-col py-4 gap-1">
                     <div className="px-4 py-2 bg-base-200 border-l-4 border-primary text-xs font-bold text-base-content">Home</div>
                     <div className="px-4 py-2 text-xs text-base-content/70">My Experiences</div>
                     <div className="px-4 py-2 text-xs text-base-content/70">My Preparations</div>
                  </div>

                  {/* Mock Main Content */}
                  <div className="flex-1 bg-base-100 p-8 flex flex-col items-center justify-center relative">
                     
                     <div className="text-center mb-8">
                        <h2 className="text-2xl font-normal text-base-content">What are we doing</h2>
                        <h2 className="text-2xl font-normal text-base-content">today ?</h2>
                     </div>

                     <div className="flex gap-4 w-full justify-center">
                        {/* Card 1 */}
                        <div className="flex-1 bg-base-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-4 max-w-[200px]">
                           <div className="text-sm font-serif text-base-content/80">Share an experience?</div>
                           <button className="btn btn-primary btn-sm rounded-full text-xs">Yup! Let's do it</button>
                        </div>

                        {/* Card 2 */}
                        <div className="flex-1 bg-base-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-4 max-w-[200px]">
                           <div className="text-sm font-serif text-base-content/80">Prepare for an interview ?</div>
                           <button className="btn btn-primary btn-sm rounded-full text-xs">Yes! Let's Break a leg</button>
                        </div>
                     </div>

                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Save Button */}
      <div className="flex justify-end pt-8">
        <Link 
          to="/" 
          className="btn btn-primary rounded-full px-10 text-white shadow-lg"
        >
          <Check size={18} className="mr-2"/> Save Changes
        </Link>
      </div>

      </div>
    </div>
  );
};
export default ChangeThemePage;
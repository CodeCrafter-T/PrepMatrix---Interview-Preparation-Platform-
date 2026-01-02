import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "url('/img.png')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Login container */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center md:justify-between p-4 lg:px-8">
        
        <div className="bg-white/90 backdrop-blur-xl w-full max-w-md py-20 px-12 rounded-[2.5rem] shadow-2xl border border-white/60 relative">
            
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-blue-600 italic" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>PrepMatrix</h1>
                <h2 className="text-2xl font-medium text-gray-800 mt-6 font-serif">Sign In</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="form-control">
                    <input
                        type="email"
                        className="input w-full h-14 rounded-full bg-white border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 text-gray-800 px-6 text-lg shadow-sm transition-all placeholder:text-gray-400"
                        placeholder="Email ID"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="form-control">
                    <input
                        type="password"
                        className="input w-full h-14 rounded-full bg-white border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 text-gray-800 px-6 text-lg shadow-sm transition-all placeholder:text-gray-400"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-base">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                            Click here
                        </Link>
                    </p>
                </div>

                {/* Login Button */}
                <button 
                    type="submit" 
                    className="btn w-full h-14 mt-4 rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white text-lg font-bold shadow-lg shadow-blue-600/30 disabled:bg-blue-300 transition-all hover:scale-[1.02]" 
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <Loader2 className="size-7 animate-spin" />
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
        </div>

        {/* Quote on background image */}
        <div className="hidden md:block ml-12 text-white max-w-sm">
            <h2 className="text-5xl font-bold leading-tight drop-shadow-xl font-serif tracking-wide">
                “ Design The Career You Deserve “
            </h2>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
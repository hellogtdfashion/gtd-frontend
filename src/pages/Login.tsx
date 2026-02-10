import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from "../services/api"; 
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 1. Check for token on mount - if exists, go to profile
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
  }

  try {
      if (isLogin) {
          await authService.login({ email: formData.email, password: formData.password });
      } else {
          try {
            await authService.signup({
                email: formData.email,
                password: formData.password,
                first_name: formData.fullName, 
            });
          } catch (signupError: any) {
            // PROFESSIONAL HANDLING: Check if email exists
            const errorData = signupError.response?.data || signupError;
            if (errorData.email || JSON.stringify(errorData).includes("already exists")) {
              toast.info("An account with this email already exists. Switching to Login.");
              setIsLogin(true); // Automatically switch to login tab for the user
              setIsLoading(false);
              return;
            }
            throw signupError; // Rethrow if it's a different error (e.g. weak password)
          }

          // Auto-login after successful signup
          await authService.login({ email: formData.email, password: formData.password });
      }
      
      // Verification check
      const token = localStorage.getItem("userToken");
      if (token) {
          toast.success(isLogin ? "Welcome back to GTD!" : "Account created! Welcome to GTD.");
          navigate("/profile");
      } else {
          toast.error("Account verified, but session could not be established.");
      }

  } catch (error: any) {
      console.error("Auth Error:", error);
      // Fallback professional messaging
      const message = error.detail || error.non_field_errors?.[0] || "Invalid email or password. Please try again.";
      toast.error(message);
  } finally {
      setIsLoading(false);
  }
};

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      setIsLoading(true);
      // 1. Send code to backend
      const res = await authService.googleLogin({ code: tokenResponse.code });
      
      // 2. Extract token based on your previous project's logic
      const token = res.access || res.key || res.token;
      
      if (token) {
        // 3. Force save to storage immediately
        localStorage.setItem("userToken", token);
        
        // 4. Delay navigation by 100ms to allow storage to sync
        setTimeout(() => {
          toast.success("Logged in with Google!");
          navigate("/profile");
        }, 100);
      }
    } catch (err) {
      console.error("Google Auth Failed", err);
      toast.error("Google Login failed.");
    } finally {
      setIsLoading(false);
    }
  },
  flow: 'auth-code',
});

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F8] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-pink-100">
        <div className="text-center">
          <img src={logo} alt="GTD Logo" className="h-20 w-20 mx-auto rounded-full mb-4 border border-pink-50 shadow-sm" />
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight">{isLogin ? "Sign In" : "Create Account"}</h2>
          <p className="text-sm text-muted-foreground mt-2 italic">
            {isLogin ? "Enter your details to access your profile" : "Join the world of Glorious Threads by Divya"}
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
                placeholder="Full Name" 
                className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 focus:outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30" 
              />
            )}
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="Email address" 
              className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 focus:outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30" 
            />
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="Password" 
                className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 focus:outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 pr-10" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <input 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  placeholder="Confirm Password" 
                  className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 focus:outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 pr-10" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-black text-white rounded-full h-12 uppercase font-bold tracking-widest hover:bg-zinc-800 transition-all">
             {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Register")}
          </Button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pink-100"></div></div>
            <span className="relative px-2 bg-white text-[10px] text-muted-foreground uppercase tracking-widest">Or Continue With</span>
          </div>

          <button 
            type="button" 
            onClick={() => googleLogin()} 
            className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-pink-100 rounded-full text-xs font-bold uppercase bg-white hover:bg-[#FFF8F8] transition-colors shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </form>

        <div className="text-center text-xs uppercase tracking-widest mt-6">
          <span className="text-muted-foreground">{isLogin ? "New to GTD? " : "Already a member? "}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline">{isLogin ? "Create Account" : "Sign In"}</button>
        </div>
      </div>
    </div>
  );
}
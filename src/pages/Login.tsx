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
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
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
              await authService.signup({ email: formData.email, password: formData.password, first_name: formData.fullName });
            } catch (signupError: any) {
              // Handle existing email gracefully
              const errorData = signupError.response?.data || signupError;
              if (JSON.stringify(errorData).toLowerCase().includes("already exists")) {
                toast.info("Account already exists. Please login instead.");
                setIsLogin(true); // Switch tab
                setIsLoading(false);
                return;
              }
              throw signupError;
            }
            await authService.login({ email: formData.email, password: formData.password });
        }
        
        if (localStorage.getItem("userToken")) {
            toast.success(isLogin ? "Logged in!" : "Welcome to GTD!");
            navigate("/profile");
        }
    } catch (error: any) {
        toast.error("Invalid email or password.");
    } finally {
        setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        await authService.googleLogin({ code: tokenResponse.code });
        setTimeout(() => { navigate("/profile"); }, 100);
      } catch (err) {
        toast.error("Google Login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    flow: 'auth-code',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F8] py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-pink-100">
        <div className="text-center">
          {/* FIX: Square logo to prevent elongation */}
          <img src={logo} alt="GTD Logo" className="h-20 w-20 mx-auto rounded-full mb-6 border border-pink-50 shadow-sm aspect-square object-contain" />
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight">{isLogin ? "Login" : "Sign Up"}</h2>
          <p className="text-xs text-muted-foreground mt-2">
            {isLogin ? "Welcome back! Enter your details." : "Create an account to start shopping."}
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your Name" className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 text-sm" />
            )}
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 text-sm" />
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required placeholder="Password" className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 text-sm pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className="appearance-none rounded-xl block w-full px-4 py-3 border border-pink-100 outline-none focus:ring-1 focus:ring-primary bg-[#FFF8F8]/30 text-sm pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-black text-white rounded-full h-12 uppercase font-bold tracking-widest text-xs">
             {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "Login" : "Sign Up")}
          </Button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pink-100"></div></div>
            <span className="relative px-2 bg-white text-[10px] text-muted-foreground uppercase tracking-widest">Or Continue With</span>
          </div>

          <button type="button" onClick={() => googleLogin()} className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-pink-100 rounded-full text-xs font-bold uppercase bg-white hover:bg-[#FFF8F8] transition-colors shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </form>
        <div className="text-center text-[11px] uppercase tracking-widest mt-6">
          <span className="text-muted-foreground">{isLogin ? "No account? " : "Have an account? "}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline">{isLogin ? "Create Account" : "Login Now"}</button>
        </div>
      </div>
    </div>
  );
}
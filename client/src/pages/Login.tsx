import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // If already logged in, redirect
  if (!isLoading && user) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login({ username: username.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-violet-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 hover:rotate-6 transition-transform duration-300">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-display text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">
                Login to manage your stream team roles
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
              <div className="space-y-2 text-left">
                <label htmlFor="username" className="text-sm font-medium text-foreground ml-1">
                  Username
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your twitch username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoggingIn}
                    className="h-12 bg-background/50 border-white/10 focus:border-primary focus:ring-primary/20 pl-4 rounded-xl text-lg transition-all"
                    required
                    minLength={1}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="text-sm font-medium text-foreground ml-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                    className="h-12 bg-background/50 border-white/10 focus:border-primary focus:ring-primary/20 pl-4 rounded-xl text-lg transition-all"
                    required
                    minLength={1}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
                disabled={isLoggingIn || !username.trim() || !password.trim()}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Enter Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 text-xs text-muted-foreground">
              Simple access • No password required
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

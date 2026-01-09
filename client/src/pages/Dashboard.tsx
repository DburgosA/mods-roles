import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { RoleCard } from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, Users, RefreshCw, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { roles, claimRole, releaseRole, isClaiming, isReleasing, isLoading: rolesLoading } = useRoles();
  const [, setLocation] = useLocation();

  // Route protection
  if (!authLoading && !user) {
    setLocation("/");
    return null;
  }

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading command center...</p>
        </div>
      </div>
    );
  }

  const myRoleCount = roles?.filter(r => r.assignedUserId === user?.id).length || 0;
  const availableCount = roles?.filter(r => !r.assignedUser).length || 0;
  const totalCount = roles?.length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-700 flex items-center justify-center shadow-lg shadow-primary/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold font-display tracking-tight leading-none">Stream Team</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Role Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Live Sync Active</span>
              </div>
              
              <div className="h-8 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Active Roles</p>
            <h3 className="text-4xl font-bold font-display text-white mt-2">{totalCount}</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-card border border-white/5 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <RefreshCw className="w-24 h-24 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Available to Claim</p>
            <h3 className="text-4xl font-bold font-display text-green-400 mt-2">{availableCount}</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-900/20 border border-primary/20 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutDashboard className="w-24 h-24 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary/80">My Assignments</p>
            <h3 className="text-4xl font-bold font-display text-primary mt-2">{myRoleCount}</h3>
          </motion.div>
        </div>

        {/* Roles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <span className="w-1.5 h-8 bg-primary rounded-full block" />
              Role Assignments
            </h2>
            <div className="text-sm text-muted-foreground">
              Auto-refreshing every 5s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {roles?.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                currentUserId={user?.id}
                onClaim={claimRole}
                onRelease={releaseRole}
                isPending={isClaiming || isReleasing}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

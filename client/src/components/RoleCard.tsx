import React from 'react';
import { Button } from '@/components/ui/button';
import type { SelectRole } from '@/types/shared';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, Shield, Check, X, Lock } from 'lucide-react';

interface RoleCardProps {
  role: SelectRole;
  currentUserId?: number;
  onClaim: (id: number) => void;
  onRelease: (id: number) => void;
  isPending: boolean;
}

export function RoleCard({ role, currentUserId, onClaim, onRelease, isPending }: RoleCardProps) {
  const isTaken = !!role.assignedUser;
  const isMine = role.assignedUserId === currentUserId;
  
  // Status config
  const status = isMine 
    ? { color: "border-green-500/50 bg-green-500/5", badge: "bg-green-500/20 text-green-300" }
    : isTaken 
      ? { color: "border-secondary bg-secondary/30 opacity-75", badge: "bg-secondary text-muted-foreground" }
      : { color: "border-primary/30 bg-card hover:border-primary/60", badge: "bg-primary/20 text-primary-foreground" };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300",
        "group hover:shadow-lg",
        status.color
      )}
    >
      {/* Header with Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-background/50 border border-white/5 shadow-inner">
          <Shield className={cn("w-8 h-8", isMine ? "text-green-400" : isTaken ? "text-muted-foreground" : "text-primary")} />
        </div>
        
        {/* Status Badge */}
        {isTaken && (
          <div className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5", status.badge)}>
            {isMine ? (
              <>
                <Check className="w-3 h-3" />
                YOURS
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                TAKEN
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {role.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {role.description}
        </p>
      </div>

      {/* Footer / User Info */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
        {isTaken ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-white/10">
              <span className="font-bold text-xs">
                {role.assignedUser?.username.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                Assigned to
              </span>
              <span className="text-sm font-medium truncate text-foreground">
                {role.assignedUser?.username}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center border border-white/5 border-dashed">
              <User className="w-4 h-4 opacity-50" />
            </div>
            <span className="text-sm italic">Available</span>
          </div>
        )}

        {/* Action Button */}
        <div className="shrink-0">
          {isMine ? (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRelease(role.id)}
              disabled={isPending}
              className="h-9 px-4 shadow-red-900/20"
            >
              <X className="w-4 h-4 mr-1.5" />
              Release
            </Button>
          ) : !isTaken ? (
            <Button 
              variant="gaming" 
              size="sm"
              onClick={() => onClaim(role.id)}
              disabled={isPending}
              className="h-9 px-4 shadow-indigo-500/20"
            >
              Take Role
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled className="opacity-50 cursor-not-allowed">
              Locked
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

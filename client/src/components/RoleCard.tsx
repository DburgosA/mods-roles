import React from 'react';
import { Button } from '@/components/ui/button';
import type { SelectRole } from '@/types/shared';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  role: SelectRole;
  currentUserId: number;
  onClaim: (roleId: number) => void;
  onRelease: (roleId: number) => void;
  isClaiming: boolean;
  isReleasing: boolean;
}

export function RoleCard({ role, currentUserId, onClaim, onRelease, isClaiming, isReleasing }: RoleCardProps) {
  const isTaken = !!role.assignedUser;
  const isMine = role.assignedUserId === currentUserId;

  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl overflow-hidden",
        isMine ? "border-cyan-300 ring-2 ring-cyan-200" : "border-cyan-100"
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {role.name}
            </h3>
            {role.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {role.description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-3",
              isMine
                ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                : isTaken
                ? "bg-gray-200"
                : "bg-gradient-to-br from-cyan-100 to-blue-100"
            )}
          >
            {isTaken ? (
              <span className="text-sm font-semibold text-white">
                {role.assignedUser?.username.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <svg
                className="w-5 h-5 text-cyan-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Status */}
        {isTaken && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Asignado a:</span>
            <span className={cn("font-medium", isMine ? "text-cyan-600" : "text-gray-700")}>
              {role.assignedUser?.username}
            </span>
          </div>
        )}

        {/* Permissions */}
        {role.permissions && role.permissions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Permisos:</p>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.slice(0, 3).map((permission, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100"
                >
                  {permission}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{role.permissions.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-cyan-100">
          {isMine ? (
            <Button
              onClick={() => onRelease(role.id)}
              disabled={isReleasing}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              {isReleasing ? "Liberando..." : "Liberar Rol"}
            </Button>
          ) : isTaken ? (
            <Button disabled className="w-full bg-gray-100 text-gray-400 cursor-not-allowed">
              No Disponible
            </Button>
          ) : (
            <Button
              onClick={() => onClaim(role.id)}
              disabled={isClaiming}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {isClaiming ? "Asignando..." : "Tomar Rol"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

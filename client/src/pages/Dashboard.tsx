import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { RoleCard } from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { roles, claimRole, releaseRole, isClaiming, isReleasing, isLoading: rolesLoading } = useRoles();
  const [filter, setFilter] = useState<"all" | "available" | "mine">("all");

  if (!user) return null;

  const filteredRoles = roles?.filter((r: any) => {
    if (filter === "available") return !r.assignedUserId;
    if (filter === "mine") return r.assignedUserId === user.id;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Gestión de Roles</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user.username}</p>
              </div>
            </div>
            <Button
              onClick={() => logout()}
              variant="outline"
              className="border-cyan-200 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Filtrar:</span>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className={
                  filter === "all"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                    : "border-cyan-200 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                }
              >
                Todos
              </Button>
              <Button
                onClick={() => setFilter("available")}
                variant={filter === "available" ? "default" : "outline"}
                className={
                  filter === "available"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                    : "border-cyan-200 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                }
              >
                Disponibles
              </Button>
              <Button
                onClick={() => setFilter("mine")}
                variant={filter === "mine" ? "default" : "outline"}
                className={
                  filter === "mine"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                    : "border-cyan-200 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                }
              >
                Mis Roles
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        {rolesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Cargando roles...</p>
            </div>
          </div>
        ) : filteredRoles?.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-4">
              <svg
                className="w-8 h-8 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No hay roles disponibles
            </h3>
            <p className="text-gray-500">
              {filter === "mine"
                ? "Aún no tienes roles asignados"
                : "No se encontraron roles con este filtro"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles?.map((role: any) => (
              <RoleCard
                key={role.id}
                role={role}
                currentUserId={user.id}
                onClaim={claimRole}
                onRelease={releaseRole}
                isClaiming={isClaiming}
                isReleasing={isReleasing}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

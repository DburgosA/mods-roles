import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { InsertRole, SelectRole } from "@/types/shared";

export function useRoles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const rolesQuery = useQuery({
    queryKey: ["/api/roles"],
    queryFn: () => api.getRoles(),
  });

  const createRoleMutation = useMutation({
    mutationFn: (data: InsertRole) => api.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: "Rol creado",
        description: "El rol se ha creado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertRole> }) =>
      api.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: "Rol actualizado",
        description: "El rol se ha actualizado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol",
        variant: "destructive",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => api.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: "Rol eliminado",
        description: "El rol se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol",
        variant: "destructive",
      });
    },
  });

  const claimRoleMutation = useMutation({
    mutationFn: (roleId: number) => api.claimRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: "Rol reclamado",
        description: "Has tomado el rol exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo reclamar el rol",
        variant: "destructive",
      });
    },
  });

  const releaseRoleMutation = useMutation({
    mutationFn: (roleId: number) => api.releaseRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      toast({
        title: "Rol liberado",
        description: "Has liberado el rol exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo liberar el rol",
        variant: "destructive",
      });
    },
  });

  return {
    roles: rolesQuery.data,
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error,
    createRole: createRoleMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
    claimRole: claimRoleMutation.mutate,
    releaseRole: releaseRoleMutation.mutate,
    isClaiming: claimRoleMutation.isPending,
    isReleasing: releaseRoleMutation.isPending,
  };
}

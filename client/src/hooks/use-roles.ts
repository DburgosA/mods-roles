import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useRoles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: [api.roles.list.path],
    queryFn: async () => {
      const res = await fetch(api.roles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch roles");
      return api.roles.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Sync every 5 seconds as requested
  });

  const claimRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.roles.claim.path, { id });
      const res = await fetch(url, {
        method: api.roles.claim.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 404) {
          const error = await res.json();
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to claim role");
      }
      return api.roles.claim.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roles.list.path] });
      toast({
        title: "Role Claimed!",
        description: "You have successfully taken this role.",
        className: "bg-green-600 border-none text-white",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const releaseRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.roles.release.path, { id });
      const res = await fetch(url, {
        method: api.roles.release.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 404) {
          const error = await res.json();
          throw new Error(error.message);
        }
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to release role");
      }
      return api.roles.release.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roles.list.path] });
      toast({
        title: "Role Released",
        description: "The role is now available for others.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return {
    roles,
    isLoading,
    error,
    claimRole: claimRoleMutation.mutate,
    isClaiming: claimRoleMutation.isPending,
    releaseRole: releaseRoleMutation.mutate,
    isReleasing: releaseRoleMutation.isPending,
  };
}

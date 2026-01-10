import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        return await api.getUser();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string }) => {
      return await api.login(data.username, '');
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/user'], data);
      toast({
        title: "¡Bienvenido de nuevo!",
        description: `Sesión iniciada como ${data.username}`,
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      setLocation("/");
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

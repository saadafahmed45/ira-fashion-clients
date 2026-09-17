import { useMutation } from "@tanstack/react-query";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/app/firebase/firebase.init";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, accessToken, isLoading, hasHydrated, isAuthenticated, isAdmin, logout, setAuth } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const payload = {
        idToken,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        firebaseUid: result.user.uid,
      };
      const response = await api.post("/auth/google", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  return {
    user,
    accessToken,
    isLoading,
    hasHydrated,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    loginWithGoogle: googleMutation.mutateAsync,
    isGoogleLoggingIn: googleMutation.isPending,
    googleError: googleMutation.error,
    logout,
  };
}

export default useAuth;

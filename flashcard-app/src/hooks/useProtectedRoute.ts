"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to protect routes that require authentication.
 * Redirects to login page if user is not authenticated.
 *
 * @returns Object with isLoading and isAuthenticated status
 */
export function useProtectedRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has a valid token in sessionStorage
    const token = sessionStorage.getItem("access_token");
    const user = sessionStorage.getItem("flashlearn_user");

    if (!token || !user) {
      // No authentication found, redirect to login
      router.push("/login");
      setIsAuthenticated(false);
    } else {
      // User is authenticated
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [router]);

  return { isLoading, isAuthenticated };
}

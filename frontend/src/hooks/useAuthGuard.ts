"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store";

export function useAuthGuard() {
  const { token, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/auth");
    }
  }, [token, loading, router]);
} 
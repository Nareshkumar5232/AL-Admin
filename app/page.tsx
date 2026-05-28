"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-pulse-glow w-12 h-12 rounded-full" style={{ background: 'rgba(158, 255, 0, 0.2)' }} />
      </div>
    );
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

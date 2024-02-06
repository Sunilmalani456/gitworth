"use client";

import { ProfileForm } from "@/components/formData";
import { useState } from "react";

export default function Home() {
  const [Loading, setLoading] = useState(false);
  return (
    <main className="w-full flex min-h-screen flex-col items-center gap-1.5 px-auto">
      <h3 className="text-2xl max-sm:text-lg font-semibold tracking-tight my-2">
        Estimate Github Worth Generator 🚀
      </h3>
      <div className="w-full">
        <ProfileForm />
      </div>
    </main>
  );
}

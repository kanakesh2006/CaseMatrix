
"use client";
import React from "react";
import EvidenceForm from "@/components/forms/EvidenceForm";

export default function NewEvidencePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 className="text-3xl font-bold text-zinc-900 mb-4">Upload Evidence</h1>
      <EvidenceForm />
    </div>
  );
}



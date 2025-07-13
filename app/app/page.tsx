"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CardList from "@/components/CardList";
import DetailView from "@/components/DetailView";

const mockItems = [
  {
    id: 1,
    created_at: "2025-07-12T10:00:00Z",
    title: "AI Breakthrough in Robotics",
    link: "https://example.com/ai-robotics",
    published_date: "2025-07-11",
    summary: "Researchers unveiled a new AI model that can control complex robotic systems with natural language.",
    content: `In a joint effort between major universities, the model demonstrates remarkable dexterity, adapting in real-time...`,
  },
  {
    id: 2,
    created_at: "2025-07-12T08:00:00Z",
    title: "Open Source LLMs Surging",
    link: "https://example.com/open-llms",
    published_date: "2025-07-10",
    summary: "Open-source language models are gaining ground on commercial alternatives, with performance nearly on par.",
    content: `Community efforts and innovations in data pipelines have led to LLMs that rival proprietary models in benchmarks...`,
  },
  {
    id: 3,
    created_at: "2025-07-12T07:30:00Z",
    title: "AI in Healthcare Expanding Rapidly",
    link: "https://example.com/ai-healthcare",
    published_date: "2025-07-09",
    summary: "AI applications in diagnostics and drug discovery are accelerating, with FDA approvals for several new tools.",
    content: `Clinical trials using AI-guided diagnostics show reduced errors and faster patient turnaround in hospitals...`,
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedItem = mockItems.find((item) => item.id === selectedId) || null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex p-6 gap-6">
        <CardList
          items={mockItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="flex-1">
          <DetailView item={selectedItem} />
        </div>
      </div>
    </main>
  );
}
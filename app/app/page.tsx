"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CardList from "@/components/CardList";
import DetailView from "@/components/DetailView";
import { supabase } from "@/lib/supabaseClient";

type NewsItem = {
  id: number;
  title: string;
  link: string;
  published_date: string;
  summary: string;
  content: string;
};

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("ai_news_raw_daily")
        .select("id, title, link, published_date, summary, content")
        .order("published_date", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setItems(data);
      }
    };

    fetchData();
  }, []);

  const selectedItem = items.find((item) => item.id === selectedId) || null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-6 pt-4 pb-8">
        <div className="flex gap-6">
          <CardList
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="flex-1">
            <DetailView item={selectedItem} />
          </div>
        </div>
      </div>
    </main>
  );
}

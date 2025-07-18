"use client";

import { useEffect, useState } from "react";
import CardList from "@/components/CardList";
import DetailView from "@/components/DetailView";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("ai_news_raw_daily")
        .select("id, title, link, published_date")
        .order("published_date", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        setArticles(data);
      }
    };

    fetchArticles();
  }, []);

  const handleCardClick = async (article: any) => {
    setLoadingContent(true);
    const { data, error } = await supabase
      .from("ai_news_raw_daily")
      .select("summary, content")
      .eq("id", article.id)
      .single();

    if (error) {
      console.error("Error fetching full article:", error);
    } else {
      setSelectedArticle({ ...article, ...data });
    }
    setLoadingContent(false);
  };

  return (
    <div className="min-h-screen px-6 flex gap-6">
      <CardList articles={articles} onSelect={handleCardClick} selectedId={selectedArticle?.id} />
      <div className="flex-1">
        {loadingContent ? (
          <div>
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <DetailView item={selectedArticle} />
        )}
      </div>
    </div>
  );
}

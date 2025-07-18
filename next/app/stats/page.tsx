"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function StatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("ai_news_raw_daily")
        .select("published_date, content")
        .order("published_date", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        const grouped = data.reduce((acc: Record<string, { count: number; avgLength: number }>, row) => {
          const date = row.published_date;
          const length = row.content?.length || 0;

          if (!acc[date]) {
            acc[date] = { count: 0, avgLength: 0 };
          }

          acc[date].count += 1;
          acc[date].avgLength += length;
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([date, stats]) => ({
          date,
          count: stats.count,
          avgLength: Math.round(stats.avgLength / stats.count),
        }));

        setData(formatted);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Articles Per Day</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.ceil(data.length / 10)} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Content Length</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.ceil(data.length / 10)} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgLength" stroke="#14b8a6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

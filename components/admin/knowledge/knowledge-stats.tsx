"use client";

import { FC, memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  ChartBar,
  Folder,
} from "@phosphor-icons/react";
import { StatsOverviewCard } from "./components/stats-overview-card";
import { CategoryDistribution } from "./components/category-distribution";
import { RecentActivity } from "./components/recent-activity";
import { getCategoryConfig } from "@/lib/admin/utils";
import type { KnowledgeCategory } from "@/lib/admin/constants";

interface StatsData {
  categoryStats: Array<{
    _id: string;
    count: number;
    totalQueries: number;
  }>;
  recentActivity: Array<{
    _id: string;
    action: string;
    resource: string;
    userId: {
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
  totals: {
    chunks: number;
    queries: number;
    categories: number;
  };
  topQueried: Array<{
    _id: string;
    content: string;
    metadata: {
      category: string;
    };
    queryCount: number;
  }>;
}

interface KnowledgeStatsProps {
  stats: StatsData;
}

const KnowledgeStats: FC<KnowledgeStatsProps> = memo(({ stats }) => {

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsOverviewCard
          title="Total Knowledge Chunks"
          value={stats.totals.chunks}
          description={`Across ${stats.totals.categories} categories`}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsOverviewCard
          title="Total Queries"
          value={stats.totals.queries}
          description="AI assistant interactions"
          icon={<ChartBar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsOverviewCard
          title="Categories"
          value={stats.totals.categories}
          description="Active categories"
          icon={<Folder className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryDistribution categoryStats={stats.categoryStats} />

        {/* Top Queried */}
        <Card>
          <CardHeader>
            <CardTitle>Top Queried Knowledge</CardTitle>
            <CardDescription>Most accessed knowledge chunks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topQueried.map((chunk) => (
                <div key={chunk._id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate flex-1">{chunk.content}</p>
                    <span className="text-sm font-medium ml-2">{chunk.queryCount}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryConfig(chunk.metadata.category as KnowledgeCategory).label}
                  </Badge>
                </div>
              ))}
              {stats.topQueried.length === 0 && (
                <p className="text-sm text-muted-foreground">No queries yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentActivity activities={stats.recentActivity} />
    </div>
  );
});

KnowledgeStats.displayName = "KnowledgeStats";

export { KnowledgeStats };
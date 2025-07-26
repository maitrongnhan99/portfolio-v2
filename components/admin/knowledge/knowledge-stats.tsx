"use client";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { 
  FileTextIcon,
  ChartBarIcon,
  FolderIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

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

const KnowledgeStats: FC<KnowledgeStatsProps> = ({ stats }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      personal: "bg-blue-500",
      skills: "bg-green-500",
      experience: "bg-purple-500",
      projects: "bg-orange-500",
      education: "bg-yellow-500",
      contact: "bg-pink-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  const getActionColor = (action: string) => {
    const colors = {
      create: "text-green-600",
      update: "text-blue-600",
      delete: "text-red-600",
    };
    return colors[action as keyof typeof colors] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Knowledge Chunks</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.chunks}</div>
            <p className="text-xs text-muted-foreground">Across {stats.totals.categories} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.queries}</div>
            <p className="text-xs text-muted-foreground">AI assistant interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totals.categories}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Knowledge chunks per category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoryStats.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(cat._id)}>
                      {cat._id}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {cat.count} chunks
                    </span>
                  </div>
                  <div className="text-sm">
                    {cat.totalQueries} queries
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                    {chunk.metadata.category}
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center gap-4 text-sm">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <span className="font-medium">{activity.userId.name}</span>
                  <span className={`ml-2 ${getActionColor(activity.action)}`}>
                    {activity.action}d
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    a knowledge chunk
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { KnowledgeStats };
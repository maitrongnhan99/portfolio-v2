"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KNOWLEDGE_CATEGORIES } from "@/lib/admin/constants";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { FC } from "react";

interface KnowledgeFiltersProps {
  search: string;
  category: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onRefresh: () => void;
}

const KnowledgeFilters: FC<KnowledgeFiltersProps> = ({
  search,
  category,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortByChange,
  onRefresh,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            placeholder="Search knowledge..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {KNOWLEDGE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="metadata.lastUpdated">Updated Date</SelectItem>
              <SelectItem value="queryCount">Query Count</SelectItem>
              <SelectItem value="metadata.priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <ArrowsClockwiseIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { KnowledgeFilters };

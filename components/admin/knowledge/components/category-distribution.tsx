import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryConfig } from "@/lib/admin/utils";
import type { KnowledgeCategory } from "@/lib/admin/constants";

interface CategoryStat {
  _id: string;
  count: number;
  totalQueries: number;
}

interface CategoryDistributionProps {
  categoryStats: CategoryStat[];
}

const CategoryDistribution: FC<CategoryDistributionProps> = ({ categoryStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Knowledge chunks per category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((cat) => {
            const config = getCategoryConfig(cat._id as KnowledgeCategory);
            return (
              <div key={cat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={config.color}>
                    {config.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {cat.count} chunks
                  </span>
                </div>
                <div className="text-sm">
                  {cat.totalQueries} queries
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { CategoryDistribution };
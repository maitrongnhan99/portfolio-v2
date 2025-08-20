import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { getActionColor } from "@/lib/admin/utils";
import type { ActionType } from "@/lib/admin/constants";

interface Activity {
  _id: string;
  action: string;
  resource: string;
  userId: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions on knowledge base</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="flex items-center gap-4 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium">{activity.userId.name}</span>
                <span className={`ml-2 ${getActionColor(activity.action as ActionType)}`}>
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
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { RecentActivity };
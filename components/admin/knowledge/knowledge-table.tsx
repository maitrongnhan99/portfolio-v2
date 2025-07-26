"use client";

import { FC, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  RefreshCw 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCategoryConfig, getPriorityConfig } from "@/lib/admin/utils";
import type { KnowledgeCategory, PriorityLevel } from "@/lib/admin/constants";

interface KnowledgeChunk {
  _id: string;
  content: string;
  metadata: {
    category: string;
    priority: number;
    tags: string[];
    source: string;
    lastUpdated: string;
  };
  createdBy?: {
    name: string;
    email: string;
  };
  queryCount: number;
  version: number;
}

interface KnowledgeTableProps {
  chunks: KnowledgeChunk[];
  onEdit: (chunk: KnowledgeChunk) => void;
  onDelete: (id: string) => void;
  onRegenerateEmbedding: (id: string) => void;
}


const KnowledgeTable: FC<KnowledgeTableProps> = memo(({
  chunks,
  onEdit,
  onDelete,
  onRegenerateEmbedding,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Content</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Queries</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chunks.map((chunk) => (
            <TableRow key={chunk._id}>
              <TableCell className="max-w-[400px]">
                <p className="truncate">{chunk.content}</p>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryConfig(chunk.metadata.category as KnowledgeCategory).color}>
                  {getCategoryConfig(chunk.metadata.category as KnowledgeCategory).label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityConfig(chunk.metadata.priority as PriorityLevel).variant as any}>
                  {getPriorityConfig(chunk.metadata.priority as PriorityLevel).label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {chunk.metadata.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {chunk.metadata.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{chunk.metadata.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{chunk.queryCount}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(chunk.metadata.lastUpdated), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                {chunk.createdBy && (
                  <div className="text-sm">
                    <div>{chunk.createdBy.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {chunk.createdBy.email}
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>v{chunk.version}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(chunk)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRegenerateEmbedding(chunk._id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Embedding
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(chunk._id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

KnowledgeTable.displayName = "KnowledgeTable";

export { KnowledgeTable };
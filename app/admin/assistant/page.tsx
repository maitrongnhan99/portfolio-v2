"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeTable } from "@/components/admin/knowledge/knowledge-table";
import { KnowledgeForm } from "@/components/admin/knowledge/knowledge-form";
import { KnowledgeStats } from "@/components/admin/knowledge/knowledge-stats";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAssistantPage() {
  const { toast } = useToast();
  const [chunks, setChunks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedChunk, setSelectedChunk] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  // Fetch knowledge chunks
  const fetchChunks = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(category && { category }),
        sortBy,
      });

      const response = await fetch(`/api/admin/knowledge?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setChunks(data.chunks);
        setTotalPages(data.pagination.pages);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch knowledge chunks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchChunks();
    fetchStats();
  }, [search, category, sortBy, page]);

  // Handle create
  const handleCreate = () => {
    setFormMode("create");
    setSelectedChunk(null);
    setFormOpen(true);
  };

  // Handle edit
  const handleEdit = (chunk: any) => {
    setFormMode("edit");
    setSelectedChunk(chunk);
    setFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    try {
      const url = formMode === "create" 
        ? "/api/admin/knowledge"
        : `/api/admin/knowledge/${selectedChunk._id}`;
      
      const method = formMode === "create" ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Knowledge ${formMode === "create" ? "created" : "updated"} successfully`,
        });
        fetchChunks();
        fetchStats();
      } else {
        throw new Error("Failed to save knowledge");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${formMode} knowledge`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge chunk?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Knowledge deleted successfully",
        });
        fetchChunks();
        fetchStats();
      } else {
        throw new Error("Failed to delete knowledge");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete knowledge",
        variant: "destructive",
      });
    }
  };

  // Handle regenerate embedding
  const handleRegenerateEmbedding = async (id: string) => {
    toast({
      title: "Regenerating",
      description: "Regenerating embedding for knowledge chunk...",
    });
    // Implementation would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Management</h1>
          <p className="text-muted-foreground">
            Manage the AI assistant's knowledge base
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge
          </Button>
        </div>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Search knowledge..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="skills">Skills</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fetchChunks()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <>
                  <KnowledgeTable
                    chunks={chunks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRegenerateEmbedding={handleRegenerateEmbedding}
                  />
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t">
                      <Button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && <KnowledgeStats stats={stats} />}
        </TabsContent>
      </Tabs>

      {/* Knowledge Form Modal */}
      <KnowledgeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedChunk?.metadata ? {
          content: selectedChunk.content,
          category: selectedChunk.metadata.category,
          priority: selectedChunk.metadata.priority,
          tags: selectedChunk.metadata.tags,
          source: selectedChunk.metadata.source,
        } : undefined}
        mode={formMode}
      />
    </div>
  );
}
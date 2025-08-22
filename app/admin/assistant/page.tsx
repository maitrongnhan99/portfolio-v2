"use client";

import { FC, useState, useCallback } from "react";
import { KnowledgeTable } from "@/components/admin/knowledge/knowledge-table";
import { KnowledgeForm } from "@/components/admin/knowledge/knowledge-form";
import { KnowledgeStats } from "@/components/admin/knowledge/knowledge-stats";
import { KnowledgeFilters } from "@/components/admin/knowledge/knowledge-filters";
import { KnowledgeActions } from "@/components/admin/knowledge/knowledge-actions";
import { Pagination } from "@/components/admin/knowledge/pagination";
import { useKnowledgeData } from "@/hooks/use-knowledge-data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminAssistantPage: FC = () => {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedChunk, setSelectedChunk] = useState(null);

  const {
    chunks,
    stats,
    loading,
    filters,
    updateFilter,
    pagination,
    refresh,
    deleteChunk,
  } = useKnowledgeData();

  const handleCreate = useCallback(() => {
    setFormMode("create");
    setSelectedChunk(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((chunk: any) => {
    setFormMode("edit");
    setSelectedChunk(chunk);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      const url = formMode === "create" 
        ? "/api/admin/knowledge"
        : `/api/admin/knowledge/${selectedChunk?._id}`;
      
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
        setFormOpen(false);
        await refresh();
      } else {
        throw new Error("Failed to save knowledge");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${formMode} knowledge`,
        variant: "destructive",
      });
    }
  }, [formMode, selectedChunk, toast, refresh]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge chunk?")) {
      return;
    }
    await deleteChunk(id);
  }, [deleteChunk]);

  const handleRegenerateEmbedding = useCallback(async (id: string) => {
    toast({
      title: "Regenerating",
      description: "Regenerating embedding for knowledge chunk...",
    });
    // Implementation would go here
  }, [toast]);

  const handleImport = useCallback(() => {
    toast({
      title: "Import",
      description: "Import functionality not yet implemented",
    });
  }, [toast]);

  const handleExport = useCallback(() => {
    toast({
      title: "Export",
      description: "Export functionality not yet implemented",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-lighter">Knowledge Management</h1>
          <p className="text-slate">
            Manage the AI assistant&apos;s knowledge base
          </p>
        </div>
        <KnowledgeActions
          onImport={handleImport}
          onExport={handleExport}
          onCreate={handleCreate}
        />
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeFilters
            search={filters.search}
            category={filters.category}
            sortBy={filters.sortBy || "createdAt"}
            onSearchChange={(value) => updateFilter("search", value)}
            onCategoryChange={(value) => updateFilter("category", value)}
            onSortByChange={(value) => updateFilter("sortBy", value)}
            onRefresh={refresh}
          />

          {/* Knowledge Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-slate">Loading...</div>
              ) : (
                <>
                  <KnowledgeTable
                    chunks={chunks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRegenerateEmbedding={handleRegenerateEmbedding}
                  />
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                    onNextPage={pagination.nextPage}
                    onPreviousPage={pagination.previousPage}
                  />
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
};

export default AdminAssistantPage;
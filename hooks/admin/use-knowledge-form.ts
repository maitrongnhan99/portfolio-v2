import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const knowledgeSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["personal", "skills", "experience", "projects", "education", "contact"]),
  priority: z.number().min(1).max(3),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  source: z.string().min(1, "Source is required"),
});

export type KnowledgeFormData = z.infer<typeof knowledgeSchema>;

interface UseKnowledgeFormProps {
  initialData?: Partial<KnowledgeFormData>;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  onSuccess?: () => void;
}

export const useKnowledgeForm = ({
  initialData,
  onSubmit,
  onSuccess,
}: UseKnowledgeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      content: "",
      category: "personal",
      priority: 2,
      tags: [],
      source: "manual_entry",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        content: initialData.content || "",
        category: initialData.category || "personal",
        priority: initialData.priority || 2,
        tags: initialData.tags || [],
        source: initialData.source || "manual_entry",
      });
    }
  }, [initialData, form]);

  const handleSubmit = useCallback(async (data: KnowledgeFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onSuccess, form]);

  const addTag = useCallback(() => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  }, [tagInput, form]);

  const removeTag = useCallback((tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  }, [form]);

  const handleTagInputKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  return {
    form,
    isSubmitting,
    tagInput,
    setTagInput,
    handleSubmit,
    addTag,
    removeTag,
    handleTagInputKeyPress,
  };
};
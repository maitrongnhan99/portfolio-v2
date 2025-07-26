import { FC } from "react";
import { Plus, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeActionsProps {
  onImport: () => void;
  onExport: () => void;
  onCreate: () => void;
}

const KnowledgeActions: FC<KnowledgeActionsProps> = ({
  onImport,
  onExport,
  onCreate,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onImport}>
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Add Knowledge
      </Button>
    </div>
  );
};

export { KnowledgeActions };
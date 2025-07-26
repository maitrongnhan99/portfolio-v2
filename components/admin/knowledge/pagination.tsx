import { FC } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center p-4 border-t">
      <Button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        variant="outline"
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={onNextPage}
        disabled={!hasNextPage}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export { Pagination };
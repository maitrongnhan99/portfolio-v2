"use client";

import dynamic from "next/dynamic";
import { FC, Suspense } from "react";

const DeleteConfirmModalLazy = dynamic(async () =>
  import("@/components/common/chat/delete-confirm-modal").then(
    (module) => module.DeleteConfirmModal
  )
);

type AskMeDeleteModalProps = {
  open: boolean;
  conversationTitle?: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const AskMeDeleteModal: FC<AskMeDeleteModalProps> = ({
  open,
  conversationTitle,
  isDeleting,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Suspense fallback={null}>
      <DeleteConfirmModalLazy
        open={open}
        onOpenChange={onOpenChange}
        conversationTitle={conversationTitle}
        onConfirm={onConfirm}
        onCancel={onCancel}
        isDeleting={isDeleting}
      />
    </Suspense>
  );
};

export { AskMeDeleteModal };

import { useState } from "react";

export function useCrudUi<T extends { id: string }>() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<T | null>(null);
  const [viewRow, setViewRow] = useState<T | null>(null);
  const [deleteRow, setDeleteRow] = useState<T | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  return {
    createOpen, setCreateOpen,
    editRow, setEditRow,
    viewRow, setViewRow,
    deleteRow, setDeleteRow,
    bulkDeleteIds, setBulkDeleteIds,
  };
}

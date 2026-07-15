"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FolderInput } from "lucide-react";
import { updateSavedRecipeFolderAction } from "@/app/(main)/saved-actions";

const NEW_FOLDER_VALUE = "__new__";

export function FolderSelect({
  recipeId,
  currentFolder,
  existingFolders,
}: {
  recipeId: string;
  currentFolder: string;
  existingFolders: string[];
}) {
  const [creating, setCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function applyFolder(folder: string) {
    startTransition(async () => {
      await updateSavedRecipeFolderAction(recipeId, folder);
      router.refresh();
    });
  }

  if (creating) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newFolderName.trim()) applyFolder(newFolderName);
          setCreating(false);
          setNewFolderName("");
        }}
        className="flex items-center gap-1.5"
      >
        <input
          autoFocus
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onBlur={() => setCreating(false)}
          placeholder="Folder name"
          className="w-32 rounded-lg border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-foreground-faint">
      <FolderInput className="h-3.5 w-3.5" />
      <select
        value={currentFolder}
        disabled={isPending}
        onChange={(e) => {
          if (e.target.value === NEW_FOLDER_VALUE) setCreating(true);
          else applyFolder(e.target.value);
        }}
        className="bg-transparent text-xs focus:outline-none"
      >
        {existingFolders.map((folder) => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
        <option value={NEW_FOLDER_VALUE}>+ New folder…</option>
      </select>
    </div>
  );
}

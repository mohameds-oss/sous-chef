"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearPlannerAction } from "@/app/(main)/planner-actions";

export function ClearPlannerButton() {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-foreground-muted">Clear the whole planner?</span>
        <Button
          variant="danger"
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await clearPlannerAction();
              setConfirming(false);
              router.refresh();
            })
          }
        >
          Yes, clear it
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="h-4 w-4" /> Clear planner
    </Button>
  );
}

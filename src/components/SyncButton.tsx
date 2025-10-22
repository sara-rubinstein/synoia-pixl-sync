import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface SyncButtonProps {
  onSync: () => Promise<void>; // expects async sync function
}

export function SyncButton({ onSync }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleClick = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isSyncing}
      className="gap-2"
    >
      <RefreshCw
        className={`w-4 h-4 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
      />
      {isSyncing ? "Syncing..." : "Sync"}
    </Button>
  );
}

import { Button } from "@/components/ui/button";
import { Grid3x3, List, Table } from "lucide-react";
import { DisplayMode } from "@/types/image-library";

interface DisplayModeToggleProps {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

const modeConfig = {
  grid: { icon: Grid3x3, label: 'Grid' },
  list: { icon: List, label: 'List' },
  table: { icon: Table, label: 'Table' }
};

export function DisplayModeToggle({ currentMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex rounded-lg border bg-muted p-1">
      {(Object.keys(modeConfig) as DisplayMode[]).map((mode) => {
        const { icon: Icon, label } = modeConfig[mode];
        const isActive = currentMode === mode;
        
        return (
          <Button
            key={mode}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 px-3 py-2 ${
              isActive 
                ? 'bg-background shadow-sm text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        );
      })}
    </div>
  );
}
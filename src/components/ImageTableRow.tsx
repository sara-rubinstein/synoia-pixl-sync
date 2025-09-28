import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Trash2, RotateCcw, ExternalLink, FileText } from "lucide-react";
import { ImageItem } from "@/types/image-library";

interface ImageTableRowProps {
  image: ImageItem;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

export function ImageTableRow({ image, onDelete, onRestore }: ImageTableRowProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TableRow className={`hover:bg-muted/50 ${image.isDeleted ? 'opacity-60' : ''}`}>
      {/* Thumbnail & Name */}
      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
            <img 
              src={image.thumbnailUrl} 
              alt={image.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate max-w-[200px]">
              {image.name}
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {image.globalId}
            </div>
          </div>
        </div>
      </TableCell>

      {/* File Type & Size */}
      <TableCell className="p-3">
        <div className="text-sm">
          {image.fileType.split('/')[1].toUpperCase()}
        </div>
        <div className="text-xs text-muted-foreground">
          {image.fileSize && formatFileSize(image.fileSize)}
        </div>
      </TableCell>

      {/* Dimensions */}
      <TableCell className="p-3 text-sm">
        {image.imageWidth}×{image.imageHeight}
        {image.hasAlphaChannel && (
          <div className="text-xs text-muted-foreground">Alpha</div>
        )}
      </TableCell>

      {/* Category */}
      <TableCell className="p-3">
        {image.category && (
          <Badge variant="secondary" className="text-xs">
            {image.category}
          </Badge>
        )}
        {image.subcategory && (
          <div className="text-xs text-muted-foreground mt-1">
            {image.subcategory}
          </div>
        )}
      </TableCell>

      {/* Status */}
      <TableCell className="p-3">
        <div className="flex flex-col gap-1">
          <StatusBadge status={image.syncStatus} size="sm" />
          {image.isDeleted && (
            <Badge variant="destructive" className="text-xs w-fit">
              Deleted
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Timestamps */}
      <TableCell className="p-3">
        <div className="text-xs space-y-1">
          <div>
            <span className="text-muted-foreground">Local: </span>
            {formatDate(image.localLastUpdatedUtc)}
          </div>
          {image.cloudLastUpdatedUtc ? (
            <div>
              <span className="text-muted-foreground">Cloud: </span>
              {formatDate(image.cloudLastUpdatedUtc)}
            </div>
          ) : (
            <div className="text-muted-foreground">No cloud sync</div>
          )}
        </div>
      </TableCell>

      {/* Tags */}
      <TableCell className="p-3">
        {image.tags && image.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {image.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {image.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                +{image.tags.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No tags</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="p-3">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <ExternalLink className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <FileText className="w-3 h-3" />
          </Button>
          
          {image.isDeleted ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onRestore(image.globalId)}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDelete(image.globalId)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
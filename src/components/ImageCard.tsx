import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Trash2, RotateCcw, ExternalLink, FileText, Edit2Icon } from "lucide-react";
import { ImageItem } from "@/types/image-library";
import { openImagePreview } from "@/components/ImagePreview";


interface ImageCardProps {
  image: ImageItem;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onEdit: (image: ImageItem) => void; // <-- Add this prop

}

export function ImageCard({ image, onDelete, onRestore, onEdit }: ImageCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${image.isDeleted ? 'opacity-60 border-destructive/30' : ''}`}>
      <CardContent className="p-4">
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-3">
            <img 
              src={image.thumbnailUrl} 
              alt={image.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-2 right-2">
            <StatusBadge status={image.syncStatus} size="sm" />
          </div>
          
          {/* Deleted Badge */}
          {image.isDeleted && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs">Deleted</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title and ID */}
          <div>
            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
              {image.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              ID: {image.globalId} • {image.fileType.split('/')[1].toUpperCase()}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">{image.imageWidth}×{image.imageHeight}</span>
            </div>
            <div>
              {image.fileSize && formatFileSize(image.fileSize)}
            </div>
          </div>

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {image.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
              {image.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{image.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Description */}
          {image.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {image.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-1">
  <Button
  variant="ghost"
  size="sm"
  className="h-7 w-7 p-0"
   onClick={() => {
    const url = image.azureBlobUrl || image.thumbnailUrl;
    if (!url) return alert("No image available for preview.");
    openImagePreview(url, image.name);
  }}
  title="Preview Image"
>
  <ExternalLink className="w-3 h-3" />
</Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="view metadata"   onClick={() => alert(JSON.stringify(image.appMetadata, null, 2))}
>
                <FileText className="w-3 h-3" />
              </Button>
              <Button
  size="sm"
  variant="ghost"
  className="h-7 w-7 p-0"
  title="edit properties"
  onClick={() => onEdit(image)} // <-- Call onEdit when clicked
>
  <Edit2Icon className="w-3 h-3" />
</Button>
            </div>
            
            <div>
              {image.isDeleted ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onRestore(image.globalId)}
                  className="h-7 px-2 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restore
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
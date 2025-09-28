import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Trash2, RotateCcw, ExternalLink, FileText } from "lucide-react";
import { ImageItem } from "@/types/image-library";

interface ImageListItemProps {
  image: ImageItem;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

export function ImageListItem({ image, onDelete, onRestore }: ImageListItemProps) {
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${image.isDeleted ? 'opacity-60 border-destructive/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
              <img 
                src={image.thumbnailUrl} 
                alt={image.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {image.name}
                  </h3>
                  {image.isDeleted && (
                    <Badge variant="destructive" className="text-xs">Deleted</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span>ID: {image.globalId}</span>
                  <span>{image.fileType.split('/')[1].toUpperCase()}</span>
                  <span>{image.imageWidth}×{image.imageHeight}</span>
                  {image.fileSize && <span>{formatFileSize(image.fileSize)}</span>}
                </div>

                {image.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {image.description}
                  </p>
                )}

                {/* Tags */}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        +{image.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Status and Actions */}
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <StatusBadge status={image.syncStatus} size="sm" />
                
                <div className="text-xs text-muted-foreground text-right">
                  <div>Updated: {formatDate(image.localLastUpdatedUtc)}</div>
                  {image.cloudLastUpdatedUtc && (
                    <div>Cloud: {formatDate(image.cloudLastUpdatedUtc)}</div>
                  )}
                </div>

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
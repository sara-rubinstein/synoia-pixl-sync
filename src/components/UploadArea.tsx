import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export function UploadArea({ onFilesSelected }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp']
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`
        border-2 border-dashed cursor-pointer transition-all duration-200 p-8
        ${isDragActive 
          ? 'border-primary bg-primary/5 scale-[1.01]' 
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }
        ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {isDragReject ? (
          <>
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold text-destructive">Invalid File Type</h3>
              <p className="text-sm text-muted-foreground">Please select image files only</p>
            </div>
          </>
        ) : (
          <>
            <div className={`
              rounded-full p-4 transition-colors
              ${isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
            `}>
              {isDragActive ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isDragActive ? 'Drop images here' : 'Upload Images'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop images or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PNG, JPG, GIF, SVG, WebP
              </p>
            </div>
            <Button variant="outline" size="sm">
              Browse Files
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
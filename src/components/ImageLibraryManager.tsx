import { useState, useMemo,useEffect } from 'react';
import { Search, Filter, Upload, RefreshCw, Settings, Download } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DisplayModeToggle } from './DisplayModeToggle';
import { UploadArea } from './UploadArea';
import { ImageCard } from './ImageCard';
import { ImageListItem } from './ImageListItem';
import { ImageTableRow } from './ImageTableRow';
import { StatusBadge } from './StatusBadge';
import { EditImageModal } from "./EditImageModel"; // Correct import
import { AppMetadata, DisplayMode, ImageItem } from '@/types/image-library';
import { mockImages } from '@/data/mock-images';
import { useToast } from '@/hooks/use-toast';
import { AppSettingsModal } from './AppSettingsModal';
import { fetchCategories,fetchImages,syncImages,syncDeletedImages  } from '@/lib/images-api'; // ✅ new import
import * as exifr from 'exifr';
import { API_BASE } from "@/config";
import { SyncButton } from "./SyncButton";




export function ImageLibraryManager() {
  const { toast } = useToast();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [categories, setCategories] = useState<string[]>(['all']); // default "all" option
const [showSettings, setShowSettings] = useState(false);
const [appMetadata, setAppMetadata] = useState<AppMetadata>({
  apps: ["Cosmetician"],
  usageCode: "Main",
  langs: ["EN"],
  customTags: [],
  targetPlatforms: ["web", "mobile", "desktop","linux"],
  version: "1.0",
});



  // Filter and search logic
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (Array.isArray(image.tags) &&
              image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      // Category filter
      const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || image.syncStatus === statusFilter;

      // Deleted filter
      const matchesDeletedFilter = showDeleted || !image.isDeleted;

      return matchesSearch && matchesCategory && matchesStatus && matchesDeletedFilter;
    });
  }, [images, searchQuery, categoryFilter, statusFilter, showDeleted]);

  // Stats
  const stats = useMemo(() => {
    const total = images.filter(img => !img.isDeleted).length;
    const pending = images.filter(img => img.syncStatus === 'pending' && !img.isDeleted).length;
    const conflicts = images.filter(img => img.syncStatus === 'conflict' && !img.isDeleted).length;
    const deleted = images.filter(img => img.isDeleted).length;

    return { total, pending, conflicts, deleted };
  }, [images]);
  
 useEffect(() => {
  async function loadCategories() {
    const data = await fetchCategories();
    setCategories(['all', ...data]);
  }
  loadCategories();
}, []);
useEffect(() => {
  async function loadImages() {
    try {
     const data = await fetchImages(appMetadata.apps); // pass full array now

      const mappedImages: ImageItem[] = data.map((item: any) => ({
        globalId: item.globalId,
        name: item.name,
        description: item.description ?? "",
        category: item.category ?? "",
        tags: item.tags ?? [],
        azureBlobUrl: item.azureBlobUrl,
        cdnUrl: undefined,
        imageWidth: item.imageWidth ?? 0,
        imageHeight: item.imageHeight ?? 0,
        hasAlphaChannel: false,
        localLastUpdatedUtc: item.cloudLastUpdatedUtc ?? new Date().toISOString(),
        cloudLastUpdatedUtc: item.cloudLastUpdatedUtc,
        createdDate: item.createdDate ?? new Date().toISOString(),
        isDeleted: item.isDeleted ?? false,
        isActive: true,
        syncStatus: "up-to-date",
        fileSize: item.fileSize,
        fileType: item.fileType ?? "image/png",
        thumbnailUrl: item.azureBlobUrl, // ✅ correct preview
        appMetadata: item.appMetadata ?? {},
      }));

      setImages(mappedImages);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }

  loadImages();
}, [appMetadata.apps]);

  // Handle edit
const handleEdit = (image: ImageItem) => setEditingImage(image);

  // Handle file upload
  const handleFilesSelected = (files: File[]) => {

    toast({
      title: "Images Added",
      description: `${files.length} image(s) added to library with Global IDs.`,
    });
    setNewImages(files);
    setShowUpload(false);
  };


  const setNewImages = async (files: File[]) => {
  const newImages = await Promise.all(
    files.map(async (file, index) => {
      const { width, height } = await getImageDimensionsWithFallback(file); // ✅ use EXIF + fallback

      const globalId = -(Date.now() + index).toString();
      const previewUrl = URL.createObjectURL(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const category = 'Products';
      const currentDate = new Date().toISOString();

      const defaultMetadata = {
        apps: ['Cosmetician'],
        usageCode: 'Main',
        langs: ['EN'],
        customTags: [],
        targetPlatforms: ['web'],
        version: '1.0'
      };

      const hasAlpha = ['png', 'gif', 'webp'].includes(fileExtension);

      return {
        globalId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded ${new Date().toLocaleDateString()}`,
        originalPath: file.name,
        libraryFilePath: `W:/SYNOIA/Library Images/${file.name}`,
        category,
        tags: [],
        imageWidth: width,      // ✅ real width from EXIF or fallback
        imageHeight: height,    // ✅ real height from EXIF or fallback
        hasAlphaChannel: hasAlpha,
        azureBlobUrl: undefined,
        cdnUrl: undefined,
        localLastUpdatedUtc: currentDate,
        cloudLastUpdatedUtc: undefined,
        createdDate: currentDate,
        isDeleted: false,
        isActive: true,
        syncStatus: 'pending' as const,
        fileSize: file.size,
        fileType: file.type || `image/${fileExtension}`,
        thumbnailUrl: previewUrl,
        appMetadata: appMetadata || defaultMetadata,
        file
      } satisfies ImageItem;
    })
  );

  setImages(prev => [...newImages, ...prev]);
};
  // Handle delete/restore
  const handleDelete = (id: number) => {
    setImages(prev => prev.map(img => 
      img.globalId === id ? { ...img, isDeleted: true } : img
    ));
    toast({
      title: "Image Deleted",
      description: "Image has been moved to trash.",
    });
  };

  const handleRestore = (id: number) => {
    setImages(prev => prev.map(img => 
      img.globalId === id ? { ...img, isDeleted: false } : img
    ));
    toast({
      title: "Image Restored",
      description: "Image has been restored from trash.",
    });
  };

  // Handle sync
  const handleSync = async () => {
  const imagesToSync = images.filter(img => img.syncStatus === 'pending' && !img.isDeleted);
  const deletedOrRestored = images.filter(img => img.syncStatus !== "pending"); // all non-new images

  if (imagesToSync.length === 0 && deletedOrRestored.length === 0) {
    toast({
      title: "No Images to Sync",
      description: "All images are up to date.",
    });
    return;
  }
  
  try {
       const uploadResults = await syncImages(imagesToSync, appMetadata);
    console.log("Upload results:", uploadResults);

    const deletedCount = await syncDeletedImages(deletedOrRestored);
    console.log("Deleted/restored images synced.");

    toast({
      title: "Sync Complete",
      description: `${uploadResults.length} image(s) synced, ${deletedCount} deleted/restored.`,
    });


    // 🟢 Update local state
    setImages(prev =>
      prev.map(img => {
        const result = uploadResults.find(r => r.oldGlobalId === img.globalId);
        if (result) {
          return {
            ...img,
            globalId: result.newGlobalId,
            azureBlobUrl: result.azureBlobUrl,
            cloudLastUpdatedUtc: result.cloudLastUpdatedUtc,
            syncStatus: "up-to-date",
          };
        }
        return { ...img, syncStatus: "up-to-date" };
      })
    );

    toast({
      title: "Sync Complete",
      description: `${imagesToSync.length} image(s) synced successfully, ${deletedCount} updates applied.`,
    });
   
  } catch (error) {
    console.error('Sync error:', error);
    toast({
      title: "Sync Failed",
      description: (error as Error).message,
      variant: "destructive"
    });
  }
};
// 🟢 Get image dimensions via EXIF or fallback to natural dimensions
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// 🟢 Try EXIF first, fallback to browser-detected dimensions
async function getImageDimensionsWithFallback(file: File): Promise<{ width: number; height: number }> {
  try {
    const exif = await exifr.parse(file, ['ImageWidth', 'ImageHeight']);
    if (exif?.ImageWidth && exif?.ImageHeight) {
      return { width: exif.ImageWidth, height: exif.ImageHeight };
    }
  } catch (err) {
    console.warn('⚠️ EXIF parse failed:', err);
  }
  return getImageDimensions(file);
}

  // Helper function to determine category based on filename/type
  const statuses = ['all', 'up-to-date', 'pending', 'conflict'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Library Manager</h1>
            <p className="text-muted-foreground mt-1">
              Manage your image assets with Global ID assignment and cloud synchronization
            </p>
          </div>
          <div className="flex gap-2">
            <SyncButton onSync={handleSync} />

            <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Upload</div>
              </div>
              <StatusBadge status="pending" showIcon={false} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.conflicts}</div>
                <div className="text-sm text-muted-foreground">Conflicts</div>
              </div>
              <StatusBadge status="conflict" showIcon={false} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.deleted}</div>
              <div className="text-sm text-muted-foreground">Deleted</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="space-y-4">
            <UploadArea onFilesSelected={handleFilesSelected} />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status === 'all' ? 'All Status' : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant={showDeleted ? "default" : "outline"}
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Deleted ({stats.deleted})
                  </Button>
                </div>
              </div>

              {/* Display Mode Toggle */}
              <DisplayModeToggle 
                currentMode={displayMode} 
                onModeChange={setDisplayMode} 
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredImages.length} of {images.length} images
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Grid View */}
            {displayMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredImages.map(image => (
                  <ImageCard
                    key={`${image.globalId}-${image.name}`}
                    image={image}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onEdit={handleEdit} // <-- Pass the handler here
    
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {displayMode === 'list' && (
              <div className="space-y-3">
                {filteredImages.map(image => (
                  <ImageListItem
                    key={`${image.globalId}-${image.name}`}
                    image={image}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {displayMode === 'table' && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Image</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamps</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImages.map(image => (
                      <ImageTableRow
                        key={`${image.globalId}-${image.name}`}
                        image={image}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
{editingImage && (
  <EditImageModal
    image={editingImage}
    onClose={() => setEditingImage(null)}
    onSave={(updatedFields) => {
      setImages(prev =>
        prev.map(img =>
          img.globalId === editingImage.globalId
            ? {
                ...img,
                description: updatedFields.description,
                category: updatedFields.category,
                tags: updatedFields.tags,
                appMetadata: updatedFields.appMetadata,
              }
            : img
        )
      );
      setEditingImage(null);
    }}
  />
)}
{showSettings && (
  <AppSettingsModal
    appMetadata={appMetadata}
    onSave={(newMetadata) => {
      setAppMetadata(newMetadata);
      setShowSettings(false);
    }}
    onClose={() => setShowSettings(false)}
  />
)}
            {/* Empty State */}
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No images found</div>
                <Button onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setShowDeleted(false);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



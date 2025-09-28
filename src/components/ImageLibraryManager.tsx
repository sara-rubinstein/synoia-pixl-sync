import { useState, useMemo } from 'react';
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
import { DisplayMode, ImageItem } from '@/types/image-library';
import { mockImages } from '@/data/mock-images';
import { useToast } from '@/hooks/use-toast';

export function ImageLibraryManager() {
  const { toast } = useToast();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [images, setImages] = useState<ImageItem[]>(mockImages);
  const [showUpload, setShowUpload] = useState(false);

  // Filter and search logic
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

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

  // Handle file upload
  const handleFilesSelected = (files: File[]) => {
    const newImages: ImageItem[] = files.map(file => {
      // Generate mock Global ID (in real app, this would come from Azure Function)
      const globalId = Math.floor(Math.random() * 1000000) + 100000;
      const objectUrl = URL.createObjectURL(file);
      
      return {
        globalId,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for name
        description: `Uploaded ${file.type}`,
        originalPath: file.name,
        libraryFilePath: `library/${globalId}.${file.name.split('.').pop()}`,
        category: 'product',
        subcategory: null,
        tags: ['uploaded'],
        imageWidth: 1920, // Would be read from actual file
        imageHeight: 1080,
        hasAlphaChannel: file.type === 'image/png',
        azureBlobUrl: null,
        cdnUrl: objectUrl,
        localLastUpdatedUtc: new Date().toISOString(),
        cloudLastUpdatedUtc: null,
        createdDate: new Date().toISOString(),
        isDeleted: false,
        isActive: true,
        syncStatus: 'pending' as const,
        fileSize: file.size,
        fileType: file.type,
        thumbnailUrl: objectUrl
      };
    });

    setImages(prev => [...newImages, ...prev]);
    toast({
      title: "Images Added",
      description: `${files.length} image(s) added to library with Global IDs.`,
    });
    setNewImages(files);
    setShowUpload(false);
  };
const setNewImages=(files: File[])=>{
// Process each file and create ImageItem objects
  const newImages = files.map((file, index) => {
    // Generate a unique global ID (you might want to use a proper UUID library)
    const globalId = Math.max(...images.map(img => img.globalId), 0) + index + 1;
    
    // Create object URL for preview and thumbnail
    const previewUrl = URL.createObjectURL(file);
    
    // Extract file info
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const category = determineCategory(file.name, fileExtension); // Helper function
    const currentDate = new Date().toISOString();
    
    // Check if image has alpha channel (basic check)
    const hasAlpha = ['png', 'gif', 'webp'].includes(fileExtension);
    
    return {
      globalId,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension from display name
      description: `Uploaded ${new Date().toLocaleDateString()}`,
      originalPath: `/uploads/${file.name}`,
      libraryFilePath: `/library/${globalId}/${file.name}`,
      //category,
      //subcategory: determineSubcategory(file.name, category), // Helper function
      tags: [category, 'uploaded'],
      imageWidth: 0, // Will be updated after image loads
      imageHeight: 0, // Will be updated after image loads
      hasAlphaChannel: hasAlpha,
      azureBlobUrl: undefined, // Will be set after cloud sync
      cdnUrl: undefined, // Will be set after cloud sync
      localLastUpdatedUtc: currentDate,
      cloudLastUpdatedUtc: undefined, // Will be set after cloud sync
      createdDate: currentDate,
      isDeleted: false,
      isActive: true,
      syncStatus: 'pending' as const, // New uploads start as pending
      fileSize: file.size,
      fileType: file.type || `image/${fileExtension}`,
      thumbnailUrl: previewUrl // Using same URL for thumbnail initially
    } satisfies ImageItem; // Use satisfies instead of as for better type checking
  });

  // Add new images to the state
  setImages(prev => [...newImages, ...prev]); // Add new images at the beginning


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
  const handleSync = () => {
    toast({
      title: "Sync Started",
      description: "Checking for updates and uploading pending changes...",
    });
  };

  // Helper function to determine category based on filename/type
const determineCategory = (filename: string, extension: string): string => {
  const name = filename.toLowerCase();
  
  if (name.includes('logo') || name.includes('brand')) return '"product"';
  if (name.includes('ui') || name.includes('interface') || name.includes('button')) return '"product"';
  if (name.includes('product') || name.includes('hero')) return '"product"';
  if (name.includes('tutorial') || name.includes('step') || name.includes('guide')) return '"product"';
  
  // Default category based on file type
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) return '"product"';
  if (['svg','ico'].includes(extension)) return '"product"';
  
  return '"product"'; // default
};
  const categories = ['all', 'product', 'ui', 'branding', 'tutorial'];
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
            <Button onClick={handleSync} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync
            </Button>
            <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button variant="outline" className="gap-2">
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
                    key={image.globalId}
                    image={image}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {displayMode === 'list' && (
              <div className="space-y-3">
                {filteredImages.map(image => (
                  <ImageListItem
                    key={image.globalId}
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
                        key={image.globalId}
                        image={image}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
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
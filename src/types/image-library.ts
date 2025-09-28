export interface ImageItem {
  globalId: number;
  name: string;
  description?: string;
  originalPath: string;
  libraryFilePath: string;
  category?: 'product' | 'ui' | 'branding' | 'tutorial';
  subcategory?: 'capsule' | 'device' | 'button' | 'icon';
  tags?: string[];
  imageWidth: number;
  imageHeight: number;
  hasAlphaChannel: boolean;
  azureBlobUrl?: string;
  cdnUrl?: string;
  localLastUpdatedUtc: string;
  cloudLastUpdatedUtc?: string;
  createdDate: string;
  isDeleted: boolean;
  isActive: boolean;
  syncStatus: 'up-to-date' | 'pending' | 'conflict';
  fileSize?: number;
  fileType: string;
  thumbnailUrl: string;
}

export type DisplayMode = 'grid' | 'list' | 'table';

export interface ImagePlacement {
  placement: string;
  regionCode?: string;
  targetStakeholder?: string;
  platformTarget?: string;
  productType?: string;
}
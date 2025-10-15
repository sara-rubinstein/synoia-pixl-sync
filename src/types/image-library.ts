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
   // Enhanced sync metadata
  appMetadata: AppMetadata;
  localStorageId?: string; // SQL Server record ID
  lastSyncAttempt?: string;
  syncError?: string;
  file?: File; // <-- Add this line

}

export type DisplayMode = 'grid' | 'list' | 'table';

export interface ImagePlacement {
  placement: string;
  regionCode?: string;
  targetStakeholder?: string;
  platformTarget?: string;
  productType?: string;
}

export interface AppMetadata {
  app: string; // APP1, APP2, etc.
  usageCode: string;
  lang: 'EN' | 'HE' | 'CN' | string;
  customTags: string[];
  targetPlatforms?: string[];
  version?: string;
}

export interface SyncRequest {
  imageId: number;
  imageBlob: Blob;
  metadata: AppMetadata;
  fileName: string;
  contentType: string;
}
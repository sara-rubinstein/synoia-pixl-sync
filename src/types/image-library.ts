export interface ImageItem {
  globalId: number;
  name: string;
  description?: string;
  originalPath: string;
  libraryFilePath: string;
  category?: string;
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
  syncStatus: 'up-to-date' | 'pending' | 'conflict'|'editing' | 'error';
  fileSize?: number;
  fileType: string;
  thumbnailUrl: string;
   // Enhanced sync metadata
  appMetadata: AppMetadata;
  localStorageId?: string; // SQL Server record ID
  lastSyncAttempt?: string;
  syncError?: string;
  file?: File; // the image file itself, used for store at azure blob
  linkedProductGlobalIds?: string[]; //list of ProductGlobalID values
}
export interface ProductDto {
 globalId: string;
  productID: number;
  moduleID: number;
  moduleName: string;
  typeID: number | null;
  subTypeID: number | null;
  capsuleID: number | null;
  numBoxItems: number | null;
  moduleOem: number | null;
  withoutExpiration: boolean;
  placedInMainWarehouse: boolean;
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
  apps: string[];
  langs: string[];
  usageCode: string;
  version?: string;
  customTags: string[];
  targetPlatforms: string[];
}



export interface SyncRequest {
  imageId: number;
  imageBlob: Blob;
  metadata: AppMetadata;
  fileName: string;
  contentType: string;
}
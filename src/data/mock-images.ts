import { ImageItem } from "@/types/image-library";

export const mockImages: ImageItem[] = [
  
  {
    globalId: 100004,
    name: "Tutorial Step Screenshot",
    description: "Step 3 of the user onboarding tutorial",
    originalPath: "/uploads/tutorial-step-3.png",
    libraryFilePath: "/library/100004.png",
    category: "tutorial",
    tags: ["Product"],
    imageWidth: 1280,
    imageHeight: 720,
    hasAlphaChannel: false,
    azureBlobUrl: "https://storage.blob.core.windows.net/images/100004.png",
    cdnUrl: "https://cdn.example.com/100004.png",
    localLastUpdatedUtc: "2024-09-27T08:45:00Z",
    cloudLastUpdatedUtc: "2024-09-27T08:45:00Z",
    createdDate: "2024-09-24T11:30:00Z",
    isDeleted: false,
    isActive: true,
    syncStatus: "up-to-date",
    fileSize: 1897456,
    fileType: "image/png",
    thumbnailUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    appMetadata: undefined
  }
  
];
import { ImageItem } from "@/types/image-library";

export const mockImages: ImageItem[] = [
  
  {
    globalId: 100004,
    name: "Tutorial Step Screenshot",
    description: "Step 3 of the user onboarding tutorial",
    originalPath: "/uploads/tutorial-step-3.png",
    libraryFilePath: "/library/100004.png",
    category: "tutorial",
    tags: ["tutorial", "onboarding", "step3", "ui"],
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
  },
  {
    globalId: 100005,
    name: "Product Capsule Detail",
    description: "Close-up detail view of the capsule mechanism",
    originalPath: "/uploads/product-detail-mechanism.jpg",
    libraryFilePath: "/library/100005.jpg",
    category: "product",
    subcategory: "device",
    tags: ["product", "detail", "mechanism", "close-up"],
    imageWidth: 2048,
    imageHeight: 1536,
    hasAlphaChannel: false,
    localLastUpdatedUtc: "2024-09-27T16:10:00Z",
    createdDate: "2024-09-27T16:00:00Z",
    isDeleted: false,
    isActive: true,
    syncStatus: "pending",
    fileSize: 3245678,
    fileType: "image/jpeg",
    thumbnailUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop",
    appMetadata: undefined
  }
];
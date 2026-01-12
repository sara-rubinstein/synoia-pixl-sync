import { API_BASE } from "@/config";
import { AppMetadata, ProductDto } from "@/types/image-library";



export async function fetchCategories(): Promise<string[]> {
  const endpoint = `${API_BASE}/api/images/categories`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

    const data = await response.json();

    // Ensure it's an array of strings
    if (!Array.isArray(data)) {
      console.warn("Invalid category response:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}



// 🟢 Fetch tags
export async function fetchTags(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/api/images/tags`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// 🟢 Create new tag
export async function createTag(tag: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/images/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    });
    if (!response.ok) throw new Error(`Failed to create tag (${response.status})`);
  } catch (error) {
    console.error("Error creating tag:", error);
  }
}
export async function fetchImages(apps: string[] = []) {
  // Join apps into comma-separated string
  const query = apps.length > 0 ? `?apps=${encodeURIComponent(apps.join(','))}` : "";
  const res = await fetch(`${API_BASE}/api/images${query}`);
  if (!res.ok) throw new Error(`Failed to load images (${res.status})`);
  const data = await res.json();
  console.log(data);
  return data;
}
export async function updateImage(globalId: string, data: {
  description: string;
  category: string;
  tags: string[];
  appMetadata: AppMetadata;
  linkedProductGlobalIds: string[];
}): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/images/${globalId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update image (${response.status})`);
  } catch (error) {
    console.error("Error updating image:", error);
  }
}
export async function syncImages(images: any[], globalAppMetadata: any) {
  const endpoint = `${API_BASE}/api/images/sync-image`;
  const results: any[] = [];

  for (const img of images) {
    if (!img.file) {
      console.warn(`Missing file for ${img.name}`);
      continue;
    }

    const formData = new FormData();
    formData.append("file", img.file, img.file.name);
    formData.append(
      "metadata",
      JSON.stringify({
        Name: img.name,
        OriginalPath: img.originalPath,
        LibraryFilePath: img.libraryFilePath,
        Category: img.category,
        Tags: img.tags,
        ImageWidth: img.imageWidth,
        ImageHeight: img.imageHeight,
        HasAlphaChannel: img.hasAlphaChannel,
        LocalLastUpdatedUtc: img.localLastUpdatedUtc,
        CreatedDate: img.createdDate,
        IsDeleted: img.isDeleted,
        IsActive: img.isActive,
        FileSize: img.fileSize,
        FileType: img.fileType,
        AppMetadata: img.appMetadata || globalAppMetadata,
        Description: img.description,
        LinkedProductGlobalIds: (img.linkedProductGlobalIds ?? []).map(String),

      })
    );

    const res = await fetch(endpoint, { method: "POST", body: formData });
 if (!res.ok) {
      const text = await res.text();     // <— read error from Function
      console.error("sync-image backend error:", res.status, text);
      throw new Error(`Failed to sync image ${img.name}: ${res.status} ${text}`);
    }
    const result = await res.json();
    results.push({
      oldGlobalId: img.globalId,
      newGlobalId: result.metadata.GlobalId,
      azureBlobUrl: result.metadata.AzureBlobUrl,
      cloudLastUpdatedUtc: result.metadata.CloudLastUpdatedUtc,
    });
  }

  return results;
}

// 🟢 Sync deleted/restored images
export async function syncDeletedImages(images: any[]) {
  const endpoint = `${API_BASE}/api/images/sync-deleted`;
  const items = images.map(img => ({
    globalId: img.globalId,
    isDeleted: img.isDeleted,
  }));

  if (items.length === 0) return 0; // 🟢 nothing to sync

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) throw new Error(`Failed to sync deleted images (${res.status})`);
  return items.length; // 🟢 return count of synced items

}
export async function fetchProducts(search?: string): Promise<ProductDto[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_BASE}/api/products${params}`);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json();
}

export async function fetchAllProducts(): Promise<ProductDto[]> {

  const res = await fetch(`${API_BASE}/api/get-products`);
  if (!res.ok) throw new Error(`Failed to fetch all products (${res.status})`);
  return res.json();
}

export async function fetchImageLinkedProducts(imageGlobalId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/images/${imageGlobalId}/linked-products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.linkedProductGlobalIds) ? data.linkedProductGlobalIds : [];
}
export async function fetchCategories(): Promise<string[]> {
  const endpoint = "http://localhost:7071/api/images/categories";

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

export async function fetchImages(app: string) {
  const res = await fetch(`http://localhost:7071/api/images?app=${app}`);
  if (!res.ok) throw new Error(`Failed to load images (${res.status})`);
  const data = await res.json();
console.log(data); // ✅ safe
return data;
}


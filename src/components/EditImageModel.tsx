import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async"; // ADD
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button } from "@/components/ui/button";
import { ImageItem, AppMetadata, ProductDto } from "@/types/image-library";
import { fetchCategories, fetchTags, createTag, updateImage, fetchProducts, fetchImageLinkedProducts, } from "@/lib/images-api";
import { AppSettingsModal } from "@/components/AppSettingsModal";

export function EditImageModal({
  image,
  onClose,
  onSave,
}: {
  image: ImageItem;
  onClose: () => void;
  onSave: (fields: {
    description: string;
    category: string;
    tags: string[];
    appMetadata: AppMetadata;
    linkedProductGlobalIds: string[]; 
  }) => void;
}) {
    type ProductOption = {
label: string; 
value: string; // ProductGlobalID 
 data: ProductDto;
  };
  const [description, setDescription] = useState(image.description || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(image.category || "");
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ label: string; value: string }[]>(
    (image.tags || []).map(tag => ({ label: tag, value: tag }))
  );

  // 🟢 App metadata state
  const [appMetadata, setAppMetadata] = useState<AppMetadata>(
    image.appMetadata || {
      apps: [],
      langs: [],
      usageCode: "",
      customTags: [],
      targetPlatforms: [],
      version: "",
    }
  );

  // Modal visibility
  const [showAppSettings, setShowAppSettings] = useState(false);

  // 🟢 Load categories and tags
  useEffect(() => {
    (async () => {
      const [cats, tagsList] = await Promise.all([fetchCategories(), fetchTags()]);
      setCategories(cats);
      setTags(tagsList.map(tag => ({ label: tag, value: tag })));
    })();
  }, []);

useEffect(() => {
  let cancelled = false;

  (async () => {
    // 1) fetch linked product ids for this image
    const linkedIds = await fetchImageLinkedProducts(String(image.globalId));
        

    if (cancelled) return;

    if (!linkedIds.length) {
      setSelectedProducts([]);
      return;
    }

    // 2) fetch products list and match
    const allProducts = await fetchProducts();
    if (cancelled) return;

    const wanted = new Set(linkedIds.map(String));
    const matched = allProducts.filter(p => wanted.has(String(p.globalId)));

    setSelectedProducts(
      matched.map(p => ({
        label: `${p.moduleID} - ${p.moduleName}`,
        value: String(p.globalId),
        data: p,
      }))
    );
  })();

  return () => { cancelled = true; };
}, [image.globalId]);

    
  const loadProductOptions = async (
  inputValue: string
): Promise<ProductOption[]> => {
  try {
    const products = await fetchProducts(inputValue);
    console.log(products.map(p => ({ globalId: p.globalId, productID: p.productID, moduleID: p.moduleID })));

    return products.map(p => {
      const globalId = p.globalId ?? p.productID;
      return {
        label: `${p.moduleID} - ${p.moduleName}`,
        value:  String(globalId),     // force string
        data: p,
      };
    });
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};
  // 🟢 Async tag search
  const loadTagOptions = (inputValue: string, callback: any) => {
    const filtered = tags.filter(tag =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  // 🟢 Create new tag
  const handleCreateTag = async (inputValue: string) => {
    await createTag(inputValue);
    const newTag = { label: inputValue, value: inputValue };
    setTags(prev => [...prev, newTag]);
    setSelectedTags(prev => [...prev, newTag]);
  };

  // 🟢 Save changes
  const handleSave = async () => {
    await updateImage(image.globalId.toString(), {
       description,
      category: selectedCategory,
      tags: selectedTags.map(t => t.value),
      appMetadata,
      linkedProductGlobalIds: selectedProducts.map(p => p.value),
    });

    onSave({
      description,
      category: selectedCategory,
      tags: selectedTags.map(t => t.value),
      appMetadata,
      linkedProductGlobalIds: selectedProducts.map(p => p.value),

    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Image</h2>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select
          options={categories.map(cat => ({ label: cat, value: cat }))}
          value={categories.length ? { label: selectedCategory, value: selectedCategory } : null}
          onChange={option => setSelectedCategory(option?.value || "")}
          isClearable
        />
      </div>
      {/* Linked Products (PN) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Linked Products (PN)
        </label>
        <AsyncSelect
          isMulti
          hideSelectedOptions={false}
          cacheOptions
          defaultOptions
          loadOptions={loadProductOptions}
          value={selectedProducts}
          onChange={options =>
            setSelectedProducts(options ? (options as ProductOption[]) : [])
          }
          placeholder="Search products by PN or name..."
        />
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tags</label>
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions={tags}
          loadOptions={loadTagOptions}
          value={selectedTags}
          onChange={tags => setSelectedTags(tags ? [...tags] : [])}
          onCreateOption={handleCreateTag}
          placeholder="Type to search or create tags..."
        />
      </div>

      {/* 🟢 App Metadata Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2 text-gray-700">App Metadata</h3>

        <Button variant="outline" onClick={() => setShowAppSettings(true)}>
          Edit App Metadata
        </Button>

        <div className="mt-3 text-sm text-muted-foreground">
          <strong>Apps:</strong> {appMetadata.apps.join(", ") || "—"} <br />
          <strong>Langs:</strong> {appMetadata.langs.join(", ") || "—"} <br />
          <strong>Usage Code:</strong> {appMetadata.usageCode || "—"} <br />
          <strong>Version:</strong> {appMetadata.version || "—"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end mt-6">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {/* App Metadata Dialog */}
      {showAppSettings && (
        <AppSettingsModal
          appMetadata={appMetadata}
          onSave={(newMeta) => {
            setAppMetadata(newMeta);
            setShowAppSettings(false);
          }}
          onClose={() => setShowAppSettings(false)}
        />
      )}
    </div>
  );
}

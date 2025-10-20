import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button } from "@/components/ui/button";
import { ImageItem } from "@/types/image-library";

export function EditImageModal({ image, onClose, onSave }: {
  image: ImageItem;
  onClose: () => void;
  onSave: (fields: { description: string; category: string; tags: string[] }) => void;
}) {
  const [description, setDescription] = useState(image.description || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(image.category || "");
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ label: string; value: string }[]>(
    (image.tags || []).map(tag => ({ label: tag, value: tag }))
  );

  // Fetch categories and tags from backend
  useEffect(() => {
    fetch("http://localhost:7071/api/images/categories")
      .then(res => res.json())
      .then(data => setCategories(data));

    fetch("http://localhost:7071/api/images/tags")
      .then(res => res.json())
      .then(data => setTags(data.map((tag: string) => ({ label: tag, value: tag }))));
  }, []);

  // Autocomplete tag loader
  const loadTagOptions = (inputValue: string, callback: any) => {
    const filtered = tags.filter(tag =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  // Handle tag creation
  const handleCreateTag = async (inputValue: string) => {
    // Create tag in backend
    await fetch("http://localhost:7071/api/images/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: inputValue })
    });
    const newTag = { label: inputValue, value: inputValue };
    setTags(prev => [...prev, newTag]);
    setSelectedTags(prev => [...prev, newTag]);
  };

  const handleSave = async () => {
    // Update image
    await fetch(`http://localhost:7071/api/images/${image.globalId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, selectedCategory, tags: selectedTags.map(t => t.value) })
    });
   
    onSave({    description,
    category: selectedCategory,
    tags: selectedTags.map(t => t.value),});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Image</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select
          options={categories.map(cat => ({ label: cat, value: cat }))}
          value={categories.length ? { label: selectedCategory, value: selectedCategory } : null}
          onChange={option => setSelectedCategory(option?.value || "")}
          isClearable
        />
      </div>
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
      <div className="flex gap-2 justify-end">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
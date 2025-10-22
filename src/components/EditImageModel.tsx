import React, { useEffect, useState } from "react";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button } from "@/components/ui/button";
import { ImageItem } from "@/types/image-library";
import { fetchCategories, fetchTags, createTag, updateImage } from "@/lib/images-api";

export function EditImageModal({
  image,
  onClose,
  onSave,
}: {
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

  // 🟢 Load categories and tags
  useEffect(() => {
    (async () => {
      const [cats, tagsList] = await Promise.all([fetchCategories(), fetchTags()]);
      setCategories(cats);
      setTags(tagsList.map(tag => ({ label: tag, value: tag })));
    })();
  }, []);

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
    });

    onSave({
      description,
      category: selectedCategory,
      tags: selectedTags.map(t => t.value),
    });
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

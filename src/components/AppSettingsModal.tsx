import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tag as TagIcon, X, Plus } from "lucide-react";
import { AppMetadata } from "@/types/image-library";

interface Props {
  appMetadata: AppMetadata;
  onSave: (data: AppMetadata) => void;
  onClose: () => void;
}

export function AppSettingsModal({ appMetadata, onSave, onClose }: Props) {
  const [form, setForm] = useState<AppMetadata>({ ...appMetadata });
  const [newTag, setNewTag] = useState("");
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);

  // Predefined tags for convenience
  const predefinedTags = [
    "mobile", "desktop", "tablet", "web",
    "header", "footer", "sidebar", "content",
    "button", "icon", "logo", "banner",
    "product", "feature", "marketing", "documentation"
  ];

  // Predefined target platforms
  const availablePlatforms = ["web", "mobile", "desktop", "linux", "ios", "android"];

  // Helpers
  const handleChange = (field: keyof AppMetadata, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (tag && !form.customTags.includes(tag)) {
      setForm(prev => ({ ...prev, customTags: [...prev.customTags, tag] }));
    }
    setNewTag("");
    setIsAddingCustomTag(false);
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }));
  };

  const togglePlatform = (platform: string) => {
    setForm(prev => {
      const exists = prev.targetPlatforms?.includes(platform);
      return {
        ...prev,
        targetPlatforms: exists
          ? prev.targetPlatforms.filter(p => p !== platform)
          : [...(prev.targetPlatforms ?? []), platform],
      };
    });
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Metadata & Tag Manager</DialogTitle>
        </DialogHeader>

        {/* Application Info */}
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>App</Label>
              <Select value={form.app} onValueChange={(v) => handleChange("app", v)}>
                <SelectTrigger><SelectValue placeholder="Select App" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="APP1">APP1</SelectItem>
                  <SelectItem value="APP2">APP2</SelectItem>
                  <SelectItem value="SHARED">SHARED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select value={form.lang} onValueChange={(v) => handleChange("lang", v)}>
                <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="HE">Hebrew</SelectItem>
                  <SelectItem value="AR">Arabic</SelectItem>
                  <SelectItem value="CN">Chinese</SelectItem>
                  <SelectItem value="ES">Spanish</SelectItem>
                  <SelectItem value="FR">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Usage Code</Label>
              <Input
                value={form.usageCode}
                onChange={(e) => handleChange("usageCode", e.target.value)}
                placeholder="e.g., Main"
              />
            </div>
            <div>
              <Label>Version</Label>
              <Input
                value={form.version ?? ""}
                onChange={(e) => handleChange("version", e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>
        </div>

        {/* Target Platforms */}
        <Card className="w-full mt-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Target Platforms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map(platform => (
                <Button
                  key={platform}
                  variant={form.targetPlatforms?.includes(platform) ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => togglePlatform(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>
            {form.targetPlatforms?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.targetPlatforms.map(p => (
                  <Badge key={p} variant="secondary">{p}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No platform selected</p>
            )}
          </CardContent>
        </Card>

        {/* Tag Manager Section */}
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Tag Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Tags */}
            <div>
              <h4 className="font-medium">Current Tags</h4>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md">
                {form.customTags.length === 0 ? (
                  <span className="text-sm text-muted-foreground">No tags added</span>
                ) : (
                  form.customTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Add Tags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Add Tags</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingCustomTag(!isAddingCustomTag)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Custom Tag
                </Button>
              </div>

              {/* Predefined Tag Buttons */}
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={form.customTags.includes(tag)}
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {/* Custom Tag Input */}
              {isAddingCustomTag && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter custom tag..."
                    onKeyDown={(e) => e.key === "Enter" && addTag(newTag)}
                  />
                  <Button onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="bg-muted mt-4 p-3 rounded-md text-xs font-mono overflow-auto max-h-64">
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

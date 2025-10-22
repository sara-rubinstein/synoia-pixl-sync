import { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TagManagerProps {
  currentTags: string[];
  appMetadata: {
    app: string;
    usageCode: string;
    lang: string;
    customTags: string[];
  };
  onTagsChange: (tags: string[]) => void;
  onMetadataChange: (metadata: any) => void;
}

export default function TagManager({ currentTags, appMetadata, onTagsChange, onMetadataChange }: TagManagerProps) {
  const [newTag, setNewTag] = useState('');
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);

  const predefinedTags = [
    'mobile', 'desktop', 'tablet', 'web',
    'header', 'footer', 'sidebar', 'content',
    'button', 'icon', 'logo', 'banner',
    'product', 'feature', 'marketing', 'documentation'
  ];

  const addTag = (tag: string) => {
    if (tag && !currentTags.includes(tag)) {
      onTagsChange([...currentTags, tag]);
    }
    setNewTag('');
    setIsAddingCustomTag(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(currentTags.filter(tag => tag !== tagToRemove));
  };

  const updateMetadata = (field: string, value: string) => {
   
      onMetadataChange({
        ...appMetadata,
        [field]: value
      });
   
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagIcon className="w-5 h-5" />
          Image Metadata & Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">App</label>
            <Select value={appMetadata.app} onValueChange={(value) => updateMetadata('app', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select App" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cosmetician">Cosmetician</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="B2B">B2B</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Language</label>
            <Select value={appMetadata.lang} onValueChange={(value) => updateMetadata('lang', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="HE">Hebrew</SelectItem>
                <SelectItem value="AR">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Usage Metadata */}
        <div className="space-y-3">
          <h4 className="font-medium">Usage Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Main</label>
              <Input
                value={appMetadata.usageCode}
                onChange={(e) => updateMetadata('usageCode', e.target.value)}
                placeholder="e.g., dashboard, auth, profile"
              />
            </div>
            {/* <div>
              <label className="text-sm text-muted-foreground">Module ID</label>
              <Input
                value={appMetadata.usage.moduleId}
                onChange={(e) => updateMetadata('usageCode.moduleId', e.target.value)}
                placeholder="e.g., user-mgmt, reporting"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Front</label>
              <Input
                value={appMetadata.usage.front}
                onChange={(e) => updateMetadata('usageCode.front', e.target.value)}
                placeholder="e.g., login-page, header"
              />
            </div> */}
          </div>
        </div>

        {/* Current Tags */}
        <div className="space-y-3">
          <h4 className="font-medium">Current Tags</h4>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
            {currentTags.length === 0 ? (
              <span className="text-muted-foreground text-sm">No tags assigned</span>
            ) : (
              currentTags.map((tag) => (
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

          {/* Predefined Tags */}
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => addTag(tag)}
                disabled={currentTags.includes(tag)}
                className="text-xs"
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
                onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
              />
              <Button onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
          )}
        </div>

        {/* Preview JSON */}
        <div className="space-y-2">
          <h4 className="font-medium">Metadata Preview</h4>
          <div className="bg-muted p-3 rounded-md text-xs font-mono">
            <pre>{JSON.stringify({ ...appMetadata, tags: currentTags }, null, 2)}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
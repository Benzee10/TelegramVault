import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AiContentGeneratorProps {
  onContentGenerated?: (content: string) => void;
  initialContent?: string;
  type?: "campaign" | "template";
}

export function AiContentGenerator({ 
  onContentGenerated, 
  initialContent = "",
  type = "campaign"
}: AiContentGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("friendly");
  const [generatedContent, setGeneratedContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe what content you'd like to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedContent(data.content);
        onContentGenerated?.(data.content);
        toast({
          title: "Content generated!",
          description: "Your AI-powered content is ready.",
        });
      } else {
        throw new Error(data.error || "Failed to generate content");
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!generatedContent.trim()) {
      toast({
        title: "No content to improve",
        description: "Generate or enter some content first.",
        variant: "destructive",
      });
      return;
    }

    setIsImproving(true);
    try {
      const response = await fetch("/api/ai/improve-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: generatedContent, 
          goals: ["engaging", "clear", "actionable"] 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedContent(data.content);
        onContentGenerated?.(data.content);
        toast({
          title: "Content improved!",
          description: "Your content has been enhanced by AI.",
        });
      } else {
        throw new Error(data.error || "Failed to improve content");
      }
    } catch (error) {
      toast({
        title: "Improvement failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Content Generator
          <Badge variant="secondary">Powered by Gemini</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Description</label>
          <Input
            placeholder="e.g., Welcome message for new subscribers, product announcement, event invitation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Content</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImprove}
                  disabled={isImproving}
                >
                  {isImproving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Improve"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea
              value={generatedContent}
              onChange={(e) => {
                setGeneratedContent(e.target.value);
                onContentGenerated?.(e.target.value);
              }}
              className="min-h-[120px]"
              placeholder="Generated content will appear here..."
            />
            <div className="text-xs text-muted-foreground">
              Character count: {generatedContent.length}/4096
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Bot, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const autoResponderSchema = z.object({
  trigger: z.string().min(1, "Trigger word is required"),
  response: z.string().min(1, "Response is required"),
  priority: z.number().default(0),
});

type AutoResponderFormData = z.infer<typeof autoResponderSchema>;

interface AutoResponderManagerProps {
  botId: string;
}

export function AutoResponderManager({ botId }: AutoResponderManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: autoResponders = [], isLoading } = useQuery({
    queryKey: ["/api/bots", botId, "auto-responders"],
    queryFn: () => fetch(`/api/bots/${botId}/auto-responders`).then(res => res.json()),
    enabled: !!botId,
  });

  const form = useForm<AutoResponderFormData>({
    resolver: zodResolver(autoResponderSchema),
    defaultValues: {
      trigger: "",
      response: "",
      priority: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AutoResponderFormData) => {
      const response = await fetch(`/api/bots/${botId}/auto-responders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create auto-responder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots", botId, "auto-responders"] });
      toast({
        title: "Auto-responder created",
        description: "Your new auto-responder is now active.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create auto-responder.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (responderId: string) => {
      const response = await fetch(`/api/auto-responders/${responderId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete auto-responder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots", botId, "auto-responders"] });
      toast({
        title: "Auto-responder deleted",
        description: "The auto-responder has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete auto-responder.",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ responderId, isActive }: { responderId: string; isActive: boolean }) => {
      const response = await fetch(`/api/auto-responders/${responderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update auto-responder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots", botId, "auto-responders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update auto-responder.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AutoResponderFormData) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Auto-Responders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading auto-responders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Auto-Responders
            <Badge variant="secondary">{autoResponders.length}</Badge>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Responder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Auto-Responder</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trigger"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger Word/Phrase</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., help, support, hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the automatic response..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority (0-10)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            max="10"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {autoResponders.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auto-responders</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create keyword-based responses for common questions. AI will handle unmatched messages.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Responder
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {autoResponders.map((responder: any) => (
              <div
                key={responder.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{responder.trigger}</Badge>
                    {responder.priority > 0 && (
                      <Badge variant="secondary">Priority: {responder.priority}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{responder.response}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={responder.isActive}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({
                        responderId: responder.id,
                        isActive: checked,
                      })
                    }
                    disabled={toggleMutation.isPending}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(responder.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border">
              💡 Tip: Messages that don't match any auto-responder will be handled by AI using Google Gemini for intelligent responses.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
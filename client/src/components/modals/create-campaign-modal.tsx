import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertCampaignSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AiContentGenerator } from "@/components/ai-content-generator";
import { z } from "zod";

const createCampaignFormSchema = insertCampaignSchema.pick({
  botId: true,
  name: true,
  description: true,
  message: true,
  status: true,
});

type CreateCampaignFormData = z.infer<typeof createCampaignFormSchema>;

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bots = [] } = useQuery({
    queryKey: ["/api/bots"],
    enabled: open,
  });

  const form = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignFormSchema),
    defaultValues: {
      botId: "",
      name: "",
      description: "",
      message: "",
      status: "draft",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CreateCampaignFormData) => {
      const response = await apiRequest("POST", "/api/campaigns", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign Created",
        description: "Your campaign has been successfully created.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCampaignFormData) => {
    createCampaignMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="botId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bots.map((bot: any) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name} (@{bot.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the campaign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Tabs defaultValue="manual" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual">Write Manually</TabsTrigger>
                        <TabsTrigger value="ai">AI Generate</TabsTrigger>
                      </TabsList>
                      <TabsContent value="manual" className="mt-2">
                        <Textarea 
                          placeholder="Enter the message to send to subscribers"
                          rows={4}
                          {...field}
                        />
                      </TabsContent>
                      <TabsContent value="ai" className="mt-2">
                        <AiContentGenerator
                          type="campaign"
                          initialContent={field.value}
                          onContentGenerated={field.onChange}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCampaignMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

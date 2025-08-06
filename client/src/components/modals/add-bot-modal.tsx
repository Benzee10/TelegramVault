import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertBotSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const addBotFormSchema = insertBotSchema.pick({
  token: true,
  description: true,
});

type AddBotFormData = z.infer<typeof addBotFormSchema>;

interface AddBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddBotModal({ open, onOpenChange }: AddBotModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddBotFormData>({
    resolver: zodResolver(addBotFormSchema),
    defaultValues: {
      token: "",
      description: "",
    },
  });

  const createBotMutation = useMutation({
    mutationFn: async (data: AddBotFormData) => {
      const response = await apiRequest("POST", "/api/bots", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Bot Added",
        description: "Your bot has been successfully added and configured.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add bot. Please check your token and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddBotFormData) => {
    createBotMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Bot</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Token</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your Telegram bot token"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    Get your bot token from @BotFather on Telegram
                  </p>
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
                    <Textarea 
                      placeholder="Describe what this bot will be used for"
                      {...field}
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createBotMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createBotMutation.isPending ? "Adding Bot..." : "Add Bot"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

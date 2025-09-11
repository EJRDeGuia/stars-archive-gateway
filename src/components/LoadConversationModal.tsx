import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, MessageCircle, Calendar, X } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useSavedConversations, useDeleteConversation } from "@/hooks/useApi";
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

type LoadConversationModalProps = {
  open: boolean;
  onClose: () => void;
  onLoad: (conversation: any) => void;
};

const LoadConversationModal: React.FC<LoadConversationModalProps> = ({
  open,
  onClose,
  onLoad,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: savedConversations, isLoading } = useSavedConversations(user?.id);
  const deleteConversation = useDeleteConversation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLoad = (conversation: any) => {
    onLoad(conversation);
  };

  const handleDelete = async (conversationId: string, conversationName: string) => {
    setDeletingId(conversationId);
    try {
      await deleteConversation.mutateAsync(conversationId);
      toast({
        title: "Conversation Deleted",
        description: `"${conversationName}" has been removed from your saved conversations.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-dlsl-green flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Load Saved Conversation
          </DialogTitle>
          <DialogDescription>
            Choose a conversation to continue where you left off.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">Loading conversations...</div>
            </div>
          ) : !savedConversations || savedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <MessageCircle className="h-12 w-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium">No saved conversations</p>
              <p className="text-sm text-slate-400 mt-1">Start chatting and save your conversations for later!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedConversations.map((conversation: any) => (
                <Card 
                  key={conversation.id} 
                  className="cursor-pointer hover:shadow-md transition-all border-slate-200 hover:border-dlsl-green/30 group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => handleLoad(conversation)}
                      >
                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-dlsl-green transition-colors">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>
                            {conversation.conversation_data?.length || 0} messages
                          </span>
                        </div>
                        {conversation.conversation_data && conversation.conversation_data.length > 0 && (
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {conversation.conversation_data
                              .filter((item: any) => item.type === 'user')
                              .slice(-1)[0]?.query || 'No messages yet'}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conversation.id, conversation.name);
                        }}
                        disabled={deletingId === conversation.id}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 h-8 w-8"
                        title="Delete conversation"
                      >
                        {deletingId === conversation.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadConversationModal;
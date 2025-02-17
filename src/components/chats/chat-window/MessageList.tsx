import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat-type";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ImagePreview from "@/components/utils/ImagePreview";
import VideoPreview from "@/components/utils/VideoPreview";
import useUserStore from '@/stores/userStore';
import useChatStore from "@/stores/chatStore"
import { SearchUserOrGroup } from "@/components/chats/SearchUserOrGroup";

import CustomDropdownMenu from './message-list/CustomDropdownMenu';
import ShareButton from './message-list/ShareButton';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  conversation: any;
  onDeleteMessage: (messageId: number) => void;
  onUpdateMessage: (messageId: number, newContent: string) => void;
  onShareMessage: (message: Message, user: any) => void;
  onDeleteFile: (messageId: number, fileId: number) => void;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-En", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
};

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, conversation, onDeleteMessage, onUpdateMessage, onShareMessage, onDeleteFile }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const msgContentRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpenMessageId, setDropdownOpenMessageId] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);


  const { users } = useUserStore();
  const { groups,fetchGroups } = useChatStore();
  const [isSearchUserForSharingMessageOpen, setIsSearchUserForSharingMessageOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchGroups();
  }, []);

 const handleOpenSearchUserForSharingMessage = async (message: Message) => {


  setSelectedMessage( message);

  setIsSearchUserForSharingMessageOpen(true);
};

  const handleCloseSearchUserForSharingMessage = () => {
    setIsSearchUserForSharingMessageOpen(false);
    setSelectedMessage(null);

  };


  const handleUserSelection = (user: any) => {
    if (selectedMessage) {
      onShareMessage(selectedMessage, user, null);
      handleCloseSearchUserForSharingMessage();
    }
  };

  const handleGroupSelection = (group: any) => {
    if (selectedMessage) {
      onShareMessage(selectedMessage, null, group);
      handleCloseSearchUserForSharingMessage();
    }
  };

  const startEditingMessage = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditedMessageContent(currentContent);
  };

  const handleUpdateMessage = async (messageId: number) => {
    if (editedMessageContent) {
      try {
        onUpdateMessage(messageId, editedMessageContent);
        setEditingMessageId(null);
        setEditedMessageContent("");
      } catch (error) {
        console.error("Failed to update message:", error);
      }
    }
  };

  const closeDropdown = () => {
    setDropdownOpenMessageId(null);
  };

  const toggleDropdown = (messageId: number) => {
    setDropdownOpenMessageId((prevId) => (prevId === messageId ? null : messageId));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);




  const formatMessageContent = (content: string, maxCharsPerLine = 45) => {
    const splitLongSequences = (text: string, maxChars: number) => {
      return text.split(" ").map(word => {
        if (word.length > maxChars) {
          const chars = word.split("");
          let newWord = "";
          let charCount = 0;

          chars.forEach(char => {
            newWord += char;
            charCount++;

            if (charCount === maxChars) {
              newWord += "\n";
              charCount = 0;
            }
          });

          return newWord.trim();
        }

        return word;
      }).join(" ");
    };

    const adjustedContent = splitLongSequences(content, maxCharsPerLine);
    const lines: string[] = [];
    let currentLine = "";

    adjustedContent.split(" ").forEach(word => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines.join("\n");
  };




  return (
    <main className="flex-1 overflow-y-scroll h-auto p-4 space-y-4">
      {messages.reduce((acc, msg, index) => {
        const msgDate = formatDate(msg.timestamp);
        const prevDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null;
        const isNewDay = msgDate !== prevDate;

        if (isNewDay) {
          acc.push(
            <div key={`date-${msg.id}`} className="text-center text-sm text-muted-foreground my-4">
              {msgDate}
            </div>
          );
        }

        const isCurrentUserSender = msg.sender.id === currentUserId;

        acc.push(
          <div
            key={msg.id}
            className={`flex items-end space-x-2 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUserSender && (
              <Avatar className={"w-6 h-6"}>
                {msg.sender?.profile_picture ? (
                  <AvatarImage
                    src={typeof msg.sender.profile_picture === "string" ? msg.sender.profile_picture : URL.createObjectURL(msg.sender.profile_picture)}
                    alt="S"
                  />
                ) : (
                  <AvatarFallback>{msg.sender.username.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            )}

            <div className={`flex flex-col space-y-0.5 ${isCurrentUserSender ? 'items-end' : 'items-start'}`}>
              <div className={"flex space-x-2"}>
                {!isCurrentUserSender && msg.sender && conversation?.group && (
                  <p className="text-xs text-muted-foreground">{msg.sender.username}</p>
                )}
                <span className={"text-xs text-muted-foreground"}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {msg.content && (
                <div className={"flex space-x-6 items-center "}>
                  {isCurrentUserSender && (
                    <DropdownMenu open={dropdownOpenMessageId === msg.id} onOpenChange={() => toggleDropdown(msg.id)}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                          <EllipsisVertical className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="animate-slide-down">
                        <DropdownMenuItem asChild onClick={() => { closeDropdown(); handleOpenSearchUserForSharingMessage(msg) }}>
                          <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
                            Share
                          </Button>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild onClick={() => { closeDropdown(); startEditingMessage(msg.id, msg.content); }}>
                          <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
                            Modify
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild onClick={() => { closeDropdown(); onDeleteMessage(msg.id); }}>
                          <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <div className="flex relative" ref={msgContentRef}>
                    {!isCurrentUserSender && (
                      <div className="flex items-end space-x-0">
                        <span className="w-2 h-2 bg-muted rounded-full"></span>
                        <span className="w-3 h-3 bg-muted rounded-full"></span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg -ml-1 -mr-1 ${
                        isCurrentUserSender
                          ? "bg-gradient-to-r from-primary to-[#149911] text-white"
                          : "bg-gradient-to-r from-muted to-transparent"
                      } max-w-full break-words`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{formatMessageContent(msg.content)}</p>
                    </div>
                    {isCurrentUserSender && (
                      <div className="flex items-end space-x-0">
                        <span className="w-3 h-3 bg-[#149911] rounded-full"></span>
                        <span className="w-2 h-2 bg-[#149911] rounded-full"></span>
                      </div>
                    )}
                  </div>
                  {!isCurrentUserSender && (
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleOpenSearchUserForSharingMessage(msg)}>
                      <Share2 className="h-3 w-3 text-muted-foreground " />
                    </Button>
                  )}
                </div>
              )}

              {editingMessageId === msg.id && (
                <Dialog open={true} onOpenChange={() => setEditingMessageId(null)}>
                  <DialogContent>
                    <div className="flex flex-col space-y-2 mt-4">
                      <Textarea
                        ref={textareaRef}
                        value={editedMessageContent}
                        onChange={(e) => setEditedMessageContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        style={{ maxHeight: "120px" }}
                      />
                      <Button onClick={() => handleUpdateMessage(msg.id)} className="w-full mt-2 p-3">
                        Validate
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <div className={`flex flex-col space-y-2 ${isCurrentUserSender ? 'items-end' : 'items-start'}`}>
                {msg?.files && msg.files.map((fileObj) => {
                  const fileURL = fileObj.file;
                  const fileExtension = fileURL?.split('.').pop()?.toLowerCase();

                  if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {

                    return (
                            <div className={"flex space-x-6 items-center "}>

                              {isCurrentUserSender && (
                                <CustomDropdownMenu
                                  isOpen={dropdownOpenMessageId === fileObj.id}
                                  onOpenChange={() => toggleDropdown(fileObj.id)}
                                  onShare={() => { closeDropdown(); handleOpenSearchUserForSharingMessage(fileObj); }}
                                  onDelete={() => { closeDropdown(); onDeleteFile(msg.id, fileObj.id); }}
                                />
                              )}
                              <ImagePreview key={fileObj.id} fileURL={fileURL} />
                              {!isCurrentUserSender && (
                                <ShareButton onClick={() => handleOpenSearchUserForSharingMessage(fileObj)} />
                              )}
                            </div>
                        )
                    ;


                  }
                  else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                    return (
                          <div className={"flex space-x-6 items-center "}>
                            {isCurrentUserSender && (
                              <CustomDropdownMenu
                                isOpen={dropdownOpenMessageId === fileObj.id}
                                onOpenChange={() => toggleDropdown(fileObj.id)}
                                onShare={() => { closeDropdown(); handleOpenSearchUserForSharingMessage(fileObj); }}
                                onDelete={() => { closeDropdown(); onDeleteFile(msg.id, fileObj.id); }}
                              />
                            )}
                            <VideoPreview key={fileObj.id} fileURL={fileURL} />
                            {!isCurrentUserSender && (
                              <ShareButton onClick={() => handleOpenSearchUserForSharingMessage(fileObj)} />
                            )}
                          </div>
                        );

                  } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
                   return (
                      <div className={"flex space-x-6 items-center "}>
                        {isCurrentUserSender && (
                          <CustomDropdownMenu
                            isOpen={dropdownOpenMessageId === fileObj.id}
                            onOpenChange={() => toggleDropdown(fileObj.id)}
                            onShare={() => { closeDropdown(); handleOpenSearchUserForSharingMessage(fileObj); }}
                            onDelete={() => { closeDropdown(); onDeleteFile(msg.id, fileObj.id); }}
                          />
                        )}
                        <audio
                          key={fileObj.id}
                          src={fileURL}
                          controls
                          className="w-20 h-20"
                        />
                        {!isCurrentUserSender && (
                          <ShareButton onClick={() => handleOpenSearchUserForSharingMessage(fileObj)} />
                        )}
                      </div>
                    );
                  } else {

                    return (
                        <div className={"flex space-x-6 items-center "}>
                          {isCurrentUserSender && (
                            <CustomDropdownMenu
                              isOpen={dropdownOpenMessageId === fileObj.id}
                              onOpenChange={() => toggleDropdown(fileObj.id)}
                              onShare={() => { closeDropdown(); handleOpenSearchUserForSharingMessage(fileObj); }}
                              onDelete={() => { closeDropdown(); onDeleteFile(msg.id, fileObj.id); }}
                            />
                          )}
                          <div key={fileObj.id} className="mt-2">
                            <a
                              href={fileURL}
                              download
                              className="text-sm border-2 border-t-0 border-dashed border-bg-muted font-semibold text-foreground hover:text-muted-foreground no-underline bg-transparent px-2 py-1 rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                            >
                              {fileURL?.split('/').pop()}
                            </a>
                          </div>
                          {!isCurrentUserSender && (
                            <ShareButton onClick={() => handleOpenSearchUserForSharingMessage(fileObj)} />
                          )}
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          </div>
        );

        return acc;
      }, [])}
      <div ref={messagesEndRef} />
      <Dialog open={isSearchUserForSharingMessageOpen} onOpenChange={handleCloseSearchUserForSharingMessage}>
        <DialogContent>
              <SearchUserOrGroup
                users={users}
                groups={groups}
                onSelectUser={handleUserSelection}
                onSelectGroup={handleGroupSelection}
                onClose={handleCloseSearchUserForSharingMessage}
              />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MessageList;
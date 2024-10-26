'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, Download, Edit2, Send, X, ChevronDown, User, Shuffle, Smile, Image, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { generateRandomUsername } from '@/lib/utils'
import { changeUsername, setDeleteTimer, downloadChat, createWebSocketConnection, sendWebSocketMessage, importChat, deleteRoom } from '@/lib/api'

type Message = {
  id: string
  username: string
  content: string
  timestamp: Date
  type: 'text' | 'emoji'
}

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '🎉', '🔥', '❤️', '😎']

export default function ChatRoom({ params }: { params: { roomId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [username, setUsername] = useState(generateRandomUsername())
  const [timeLimit, setTimeLimit] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = createWebSocketConnection(params.roomId);
    let isActive = true;

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    wsRef.current.onmessage = (event) => {
      if (isActive) {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, {
          id: Date.now().toString(),
          username: data.username,
          content: data.message,
          timestamp: new Date(),
          type: data.type || 'text',
        }]);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to chat room",
        variant: "destructive",
      });
    };

    return () => {
      isActive = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [params.roomId, toast]);

  useEffect(() => {
    if (timeLimit && timeLimit !== 'after') {
      const minutes = parseInt(timeLimit, 10)
      if (isNaN(minutes)) {
        console.error('Invalid time limit:', timeLimit)
        return
      }
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(interval)
            void router.push('/')
            return null
          }
          return prev - 1
        })
      }, 1000)
      setRemainingTime(minutes * 60)
      return () => clearInterval(interval)
    }
  }, [timeLimit, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage && wsRef.current) {
      sendWebSocketMessage(wsRef.current, username, trimmedMessage);
      setInputMessage('');
      // Reset the textarea height
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = 'auto';
    }
  };

  const handleSendEmoji = (emoji: string) => {
    if (wsRef.current) {
      sendWebSocketMessage(wsRef.current, username, emoji, 'emoji');
    }
  };

  const handleUsernameChange = async (newUsername: string) => {
    if (newUsername && newUsername !== username) {
      try {
        const result = await changeUsername(params.roomId, newUsername);
        if (result.success) {
          setUsername(newUsername);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'username_change', oldUsername: username, newUsername }));
          }
          toast({
            title: "Username changed",
            description: `Your new username is ${newUsername}`,
          });
          setIsUsernameDialogOpen(false);
        } else {
          throw new Error(result.error || 'Failed to change username');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to change username",
          variant: "destructive",
        });
      }
    }
  };

  const handleSetTimeLimit = async (value: string) => {
    const result = await setDeleteTimer(params.roomId, value)
    if (result.success) {
      setTimeLimit(value)
      if (value !== 'after') {
        const minutes = parseInt(value, 10)
        if (!isNaN(minutes)) {
          setRemainingTime(minutes * 60)
        } else {
          console.error('Invalid time limit:', value)
        }
      } else {
        setRemainingTime(null)
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to set delete timer",
        variant: "destructive",
      })
    }
  }

  const handleDownloadChat = async (format: 'txt' | 'json') => {
    const result = await downloadChat(params.roomId, format)
    if (result.success) {
      toast({
        title: "Success",
        description: `Chat downloaded as ${format.toUpperCase()}`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to download chat",
        variant: "destructive",
      })
    }
  }

  const handleRandomizeUsername = () => {
    const newUsername = generateRandomUsername();
    handleUsernameChange(newUsername);
  };

  const handleImportChat = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast({
          title: "Error",
          description: "Only JSON files are supported for import.",
          variant: "destructive",
        });
        return;
      }
      try {
        const result = await importChat(params.roomId, file);
        if (result.success) {
          toast({
            title: "Success",
            description: "Chat imported successfully",
          });
          // Update messages with the imported data
          setMessages(result.messages.map((msg: any) => ({
            id: Date.now().toString() + Math.random(),
            username: msg[0],
            content: msg[1],
            timestamp: new Date(msg[2]),
            type: 'text',
          })));
          setIsImportDialogOpen(false);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error importing chat:', error);
        toast({
          title: "Error",
          description: "Failed to import chat",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, []);

  const handleCloseRoom = async () => {
    try {
      const result = await deleteRoom(params.roomId);
      if (result.success) {
        toast({
          title: "Room Closed",
          description: "The chat room has been deleted.",
        });
        router.push('/');
      } else {
        throw new Error(result.error || 'Failed to close room');
      }
    } catch (error) {
      console.error('Error closing room:', error);
      toast({
        title: "Error",
        description: "Failed to close the room",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-2rem)] my-4 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <h1 className="text-xl md:text-2xl font-bold">Chat Room: {params.roomId}</h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User size={16} />
                <span className="hidden md:inline">{username}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Username</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                />
                <Button onClick={() => handleUsernameChange(username)} className="w-full mt-2">
                  Save Username
                </Button>
                <Button onClick={handleRandomizeUsername} className="w-full">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random Username
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" onClick={handleCloseRoom} className="text-destructive">
            <X size={24} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${msg.username === username ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback>{msg.username[0]}</AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${
                msg.username === username ? 'bg-primary text-primary-foreground' : 'bg-muted'
              } rounded-lg p-3 break-words`}>
                <p className="font-semibold text-sm">{msg.username}</p>
                {msg.type === 'emoji' ? (
                  <p className="text-4xl">{msg.content}</p>
                ) : (
                  <p className="whitespace-pre-wrap break-all">{msg.content}</p>
                )}
                <p className="text-xs opacity-75 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="w-full space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <Select value={timeLimit || ''} onValueChange={handleSetTimeLimit}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Set delete timer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="3">3 minutes</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="after">After room closes</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-4">
              {remainingTime !== null && (
                <div className="text-sm text-muted-foreground">
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </div>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="grid gap-2">
                    <Button onClick={() => handleDownloadChat('txt')} variant="ghost" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download  as TXT
                    </Button>
                    <Button onClick={() => handleDownloadChat('json')} variant="ghost" className="w-full justify-start">
                      <Download  className="mr-2 h-4 w-4" />
                      Download as JSON
                    </Button>
                    <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          <Upload className="mr-2 h-4 w-4" />
                          Import Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Import Chat</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p>Select a JSON file to import:</p>
                          <Input
                            type="file"
                            accept=".json"
                            onChange={handleImportChat}
                            ref={fileInputRef}
                          />
                          <Button onClick={() => fileInputRef.current?.click()}>
                            Choose JSON File
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="flex-grow resize-none border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline">
                  <Smile size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="text-2xl"
                      onClick={() => handleSendEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button type="submit">
              <Send size={16} className="mr-2" />
              <span className="hidden md:inline">Send</span>
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  )
}

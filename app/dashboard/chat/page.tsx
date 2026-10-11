'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
// framer-motion removed for mobile stability
import {
  MessageSquare, Plus, Search, Trash2, PanelRightOpen, PanelRightClose,
  Send, Copy, Check, RefreshCw, Share2, ChevronDown, BookOpen,
  Sparkles, Brain, Zap, FileText, Star, Settings, ChevronLeft,
  Menu, X, Download, Pin, Edit3, GripVertical,
  Lightbulb, Target, PenTool, Notebook,
  Newspaper, BarChart3, Sword, Clock, Quote, ExternalLink,
  DollarSign, Layers, FolderOpen,
} from 'lucide-react';

interface Source {
  title: string;
  content: string;
  score: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: number;
}

type ChatStreamEvent = {
  type: 'content' | 'done' | 'error' | 'action';
  text?: string;
  sources?: Source[];
  result?: string;
};

async function consumeChatStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ChatStreamEvent) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const processLine = (line: string) => {
    if (line.trim()) onEvent(JSON.parse(line) as ChatStreamEvent);
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (value) buffer += decoder.decode(value, { stream: true });
      if (done) buffer += decoder.decode();

      let newline = buffer.indexOf('\n');
      while (newline !== -1) {
        processLine(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf('\n');
      }

      if (done) {
        processLine(buffer);
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

const WELCOME_SUGGESTIONS = [
  { icon: Sparkles, label: 'Summarize my startup', action: 'Summarize my startup vision in 3 bullet points' },
  { icon: PenTool, label: 'Generate today\'s X post', action: 'Generate a viral X thread about my latest work' },
  { icon: Layers, label: 'Explain my roadmap', action: 'Explain my product roadmap as a clear narrative' },
  { icon: Notebook, label: 'Organize my notes', action: 'Help me organize all my notes into categories' },
  { icon: Lightbulb, label: 'Create FAQs', action: 'Generate FAQs from my knowledge base' },
  { icon: Zap, label: 'Dump my memory', action: '/dump I want to dump my brain and have you organize everything' },
  { icon: Search, label: 'Search my knowledge', action: 'Search my knowledge for everything about pricing' },
  { icon: Newspaper, label: 'Generate blog', action: 'Write a blog post based on my knowledge' },
];

const AGENT_TOOLS = [
  { id: 'dump', label: 'Dump My Memory', icon: Brain, desc: 'Paste thoughts, notes, ideas — AI organizes everything' },
  { id: 'analyze', label: 'Analyze Knowledge', icon: BarChart3, desc: 'Find gaps, duplicates, and outdated info' },
  { id: 'generate', label: 'Generate Content', icon: PenTool, desc: 'Blog posts, tweets, emails, docs' },
  { id: 'organize', label: 'Organize', icon: Layers, desc: 'Categories, tags, folders, collections' },
  { id: 'improve', label: 'Improve Profile', icon: Target, desc: 'Bio, welcome message, suggested questions' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function estimateCredits(text: string): number {
  const words = text.split(/\s+/).length;
  if (words < 10) return 1;
  if (words < 100) return 2;
  if (words < 500) return 5;
  if (words < 2000) return 10;
  return 20;
}

export default function ChatYourKnowledgePage() {
  const { isSignedIn, isLoaded, userId, user } = useAuth();
  const [activeChatId, setActiveChatId] = useState<Id<'chats'> | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [knowledgePanel, setKnowledgePanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [editingChatId, setEditingChatId] = useState<Id<'chats'> | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pinnedChats, setPinnedChats] = useState<Set<Id<'chats'>>>(new Set());
  const [showToolPalette, setShowToolPalette] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [chatFilter, setChatFilter] = useState<'all' | 'today' | 'pinned'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const chats = useQuery(api.chats.getChatsByUserId, userId ? { userId } : 'skip');
  const chatMessages = useQuery(api.chats.getChatMessages, activeChatId ? { chatId: activeChatId } : 'skip');
  const knowledge = useQuery(api.knowledge.getKnowledgeByUserId, userId ? { userId } : 'skip');

  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);
  const renameChat = useMutation(api.chats.renameChat);
  const addMessage = useMutation(api.chats.addMessage);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  const sortedChats = (chats as Array<{ _id: Id<'chats'>; userId: string; title: string; createdAt: number; updatedAt: number }> | undefined)
    ?.slice()
    .sort((a, b) => b.updatedAt - a.updatedAt) || [];

  const filteredChats = sortedChats.filter(c => {
    if (chatFilter === 'pinned') return pinnedChats.has(c._id);
    if (chatFilter === 'today') return c.updatedAt >= todayTs;
    return !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    document.title = 'Chat Your Knowledge - One Question';
  }, []);

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      setMessages((chatMessages as Array<{ _id: string; role: 'user' | 'assistant'; content: string; sources?: Source[]; createdAt: number }>).map(m => ({
        id: m._id,
        role: m.role,
        content: m.content,
        sources: m.sources,
        createdAt: m.createdAt,
      })));
    }
  }, [chatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowToolPalette(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowToolPalette(false);
        setEditingMessageIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewChat = async () => {
    if (!userId) return;
    const id = await createChat({ userId, title: 'New conversation' });
    setActiveChatId(id);
    setMessages([]);
    setShowMobileSidebar(false);
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: Id<'chats'>) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    await deleteChat({ id });
    pinnedChats.delete(id);
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const handleRenameChat = async (id: Id<'chats'>) => {
    if (editTitle.trim()) {
      await renameChat({ id, title: editTitle.trim() });
    }
    setEditingChatId(null);
  };

  const handleSelectChat = (id: Id<'chats'>) => {
    setActiveChatId(id);
    setShowMobileSidebar(false);
  };

  const togglePinChat = (e: React.MouseEvent, id: Id<'chats'>) => {
    e.stopPropagation();
    setPinnedChats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToolSelect = (action: string) => {
    setInput(action);
    setShowToolPalette(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (overrideMessage?: string) => {
    const msg = overrideMessage || input;
    if (!msg.trim() || isStreaming || !userId) return;

    let chatId = activeChatId;
    const userMessage = msg.trim();

    if (overrideMessage === undefined) {
      setInput('');
    }

    setIsStreaming(true);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let fullContent = '';
    let assistantMessageId: string | undefined;
    try {
      if (!chatId) {
        const title = userMessage.length > 50 ? userMessage.slice(0, 50) + '...' : userMessage;
        chatId = await createChat({ userId, title });
        setActiveChatId(chatId);
      }

      setMessages(prev => [...prev, {
        id: 'temp-' + Date.now(),
        role: 'user',
        content: userMessage,
        createdAt: Date.now(),
      }]);
      await addMessage({ chatId, role: 'user', content: userMessage });

      controller = new AbortController();
      timeout = setTimeout(() => controller?.abort(), 60000);

      const res = await fetch('/api/chat-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage, userId }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error((await res.text()).trim() || 'AI could not answer. Please try again.');
      }
      if (!res.body) throw new Error('AI returned an empty response. Please try again.');

      let sources: Source[] = [];

      const assistantMsg: Message = {
        id: 'stream-' + Date.now(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      assistantMessageId = assistantMsg.id;
      setMessages(prev => [...prev, assistantMsg]);

      await consumeChatStream(res.body, (event) => {
        if (event.type === 'error') throw new Error('The AI response was interrupted. Please try again.');
        if (event.type === 'content' && event.text) {
          fullContent += event.text;
          setMessages(prev => prev.map(message =>
            message.id === assistantMsg.id ? { ...message, content: fullContent } : message
          ));
        } else if (event.type === 'done') {
          sources = event.sources ?? [];
        }
      });

      if (fullContent) {
        await addMessage({
          chatId,
          role: 'assistant',
          content: fullContent,
          sources: sources.length > 0 ? sources : undefined,
        });
      }

      const chat = sortedChats.find(c => c._id === chatId);
      if (chat && chat.title === 'New conversation' && fullContent) {
        const newTitle = fullContent.replace(/[#*_~`]/g, '').trim().slice(0, 60) + '...';
        await renameChat({ id: chatId, title: newTitle });
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: controller?.signal.aborted
          ? 'The AI response timed out. Please try again.'
          : error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        createdAt: Date.now(),
      }]);
    } finally {
      if (timeout) clearTimeout(timeout);
      setIsStreaming(false);
    }

    if (assistantMessageId && !fullContent) {
      setMessages(prev => prev.filter(message => message.id !== assistantMessageId));
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || isStreaming || !activeChatId || !userId) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    setMessages(prev => prev.slice(0, -1));
    setIsStreaming(true);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let fullContent = '';
    let assistantMessageId: string | undefined;
    try {
      controller = new AbortController();
      timeout = setTimeout(() => controller?.abort(), 60000);
      const res = await fetch('/api/chat-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: lastUserMsg.content, userId }),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error((await res.text()).trim() || 'AI could not answer. Please try again.');
      }
      if (!res.body) throw new Error('AI returned an empty response. Please try again.');

      const assistantMsg: Message = { id: 'stream-' + Date.now(), role: 'assistant', content: '', createdAt: Date.now() };
      assistantMessageId = assistantMsg.id;
      setMessages(prev => [...prev, assistantMsg]);

      let sources: Source[] = [];
      await consumeChatStream(res.body, (event) => {
        if (event.type === 'error') throw new Error('The AI response was interrupted. Please try again.');
        if (event.type === 'content' && event.text) {
          fullContent += event.text;
          setMessages(prev => prev.map(message =>
            message.id === assistantMsg.id ? { ...message, content: fullContent } : message
          ));
        } else if (event.type === 'done') {
          sources = event.sources ?? [];
        }
      });
      if (fullContent) {
        await addMessage({
          chatId: activeChatId,
          role: 'assistant',
          content: fullContent,
          sources: sources.length > 0 ? sources : undefined,
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: controller?.signal.aborted
          ? 'The AI response timed out. Please try again.'
          : error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        createdAt: Date.now(),
      }]);
    } finally {
      if (timeout) clearTimeout(timeout);
      setIsStreaming(false);
    }

    if (assistantMessageId && !fullContent) {
      setMessages(prev => prev.filter(message => message.id !== assistantMessageId));
    }
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${activeChatId || 'export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleContinueGeneration = async () => {
    if (!activeChatId || !userId || isStreaming) return;
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const prompt = lastAssistantMsg
      ? `Continue from where you left off. The last thing you said was:\n"""${lastAssistantMsg.content.slice(-500)}"""\n\nContinue naturally.`
      : 'Continue our conversation.';
    handleSubmit(prompt);
  };

  const handleEditMessage = (index: number) => {
    const msg = messages[index];
    if (msg.role !== 'user') return;
    setEditingMessageIndex(index);
    setEditMessageContent(msg.content);
  };

  const handleSaveEdit = () => {
    if (editingMessageIndex === null || !editMessageContent.trim()) return;
    setMessages(prev => {
      const updated = [...prev];
      updated[editingMessageIndex] = { ...updated[editingMessageIndex], content: editMessageContent.trim() };
      return updated;
    });
    setEditingMessageIndex(null);
    setEditMessageContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-zinc-600 text-sm">Loading your workspace...</p>
      </div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const firstName = user?.firstName || user?.username || 'there';
  const hasKnowledge = knowledge && knowledge.length > 0;
  const creditEstimate = input.trim() ? estimateCredits(input) : 0;

  return (
    <div className="h-dvh bg-[#0A0A0A] flex overflow-hidden select-none">
      {/* Command Palette */}
        {showToolPalette && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowToolPalette(false)}
          >
            <div
              className="w-full max-w-lg bg-[#111113] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Search className="w-4 h-4 text-zinc-500" />
                <input
                  autoFocus
                  placeholder="Search tools or type a command..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                  onKeyDown={e => {
                    if (e.key === 'Escape') setShowToolPalette(false);
                  }}
                />
                <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded-md">esc</span>
              </div>
              <div className="p-2 max-h-72 overflow-y-auto">
                {AGENT_TOOLS.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.id === 'dump') {
                        setInput('/dump ');
                        setShowToolPalette(false);
                        inputRef.current?.focus();
                      } else {
                        handleToolSelect(tool.label);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <tool.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tool.label}</p>
                      <p className="text-xs text-zinc-500">{tool.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.02]">
                <p className="text-[10px] text-zinc-600">
                  Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400">⌘K</kbd> to open anytime
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Mobile sidebar overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

      {/* Sidebar */}
      <aside
        className={`h-dvh bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col shrink-0 overflow-hidden
          ${!sidebarOpen ? 'w-0 hidden lg:hidden' : 'hidden lg:flex w-[280px]'}
          ${showMobileSidebar ? '!flex fixed left-0 top-0 z-50 w-[280px]' : ''}`}
      >
        <div className="flex items-center justify-between px-3 h-12 border-b border-white/[0.06] shrink-0">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-amber-glow">
              <MessageSquare className="w-3 h-3 text-black" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
              One<span className="text-primary">Question</span>
            </span>
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-all active:scale-[0.98] border border-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
            <span className="text-[9px] text-primary/60 ml-auto">⌘N</span>
          </button>
        </div>

        <div className="px-2 mb-1.5">
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 focus-within:border-primary/30 transition-all">
            <Search className="w-3 h-3 text-zinc-500 shrink-0" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Chat filters */}
        <div className="px-2 mb-1.5 flex gap-1">
          {(['all', 'today', 'pinned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setChatFilter(f)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                chatFilter === f ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'today' ? 'Today' : 'Pinned'}
            </button>
          ))}
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 pb-2 space-y-0.5 scrollbar-hide">
          {filteredChats.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <MessageSquare className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">
                {searchQuery || chatFilter !== 'all' ? 'Nothing found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                  activeChatId === chat._id
                    ? 'bg-primary/[0.08] text-primary'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <button
                  onClick={(e) => togglePinChat(e, chat._id)}
                  className={`shrink-0 p-0.5 transition-colors ${
                    pinnedChats.has(chat._id) ? 'text-primary' : 'text-transparent group-hover:text-zinc-500'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                </button>
                <MessageSquare className="w-3 h-3 shrink-0 opacity-60" />
                {editingChatId === chat._id ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onBlur={() => handleRenameChat(chat._id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenameChat(chat._id);
                      if (e.key === 'Escape') setEditingChatId(null);
                    }}
                    className="flex-1 bg-white/[0.06] px-1 py-0.5 rounded text-xs text-white outline-none"
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="flex-1 truncate"
                    onDoubleClick={() => {
                      setEditingChatId(chat._id);
                      setEditTitle(chat.title);
                    }}
                  >
                    {chat.title}
                  </span>
                )}
                <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePinChat(e, chat._id); }}
                    className={`p-0.5 transition-colors ${pinnedChats.has(chat._id) ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Pin className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingChatId(chat._id); setEditTitle(chat.title); }}
                    className="p-0.5 text-zinc-500 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="p-0.5 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-2 space-y-0.5">
          {[
            { icon: BookOpen, label: 'Knowledge Library', href: '/dashboard/knowledge' },
            { icon: Star, label: 'Pinned', href: '#' },
            { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all"
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-3 h-12 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]"
            >
              <Menu className="w-4 h-4" />
            </button>
            {activeChatId && (
              <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                {sortedChats.find(c => c._id === activeChatId)?.title || 'Chat'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setShowToolPalette(true)}
              className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all hidden sm:flex items-center gap-1.5"
              title="Command Palette"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px]">⌘K</span>
            </button>
            {activeChatId && messages.length > 0 && (
              <button
                onClick={handleExport}
                className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                title="Export conversation"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setKnowledgePanel(!knowledgePanel)}
              className={`p-1.5 rounded-md transition-all ${
                knowledgePanel ? 'text-primary bg-primary/[0.08]' : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Knowledge Panel"
            >
              {knowledgePanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <div className="text-center max-w-xl mx-auto w-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-5 shadow-amber-glow">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-white mb-1">
                  {getGreeting()}, {firstName}.
                </h1>
                <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  What do you want to explore in your knowledge today?
                </p>

                {!hasKnowledge ? (
                  <div className="mb-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 max-w-sm mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">Your AI has nothing to learn yet.</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                      Upload your first document to start chatting with your knowledge.
                    </p>
                    <Link
                      href="/dashboard/knowledge"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-light transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload your first document
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Suggested Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto mb-6">
                      {WELCOME_SUGGESTIONS.slice(0, 8).map((suggestion, i) => (
                        <button
                          key={suggestion.label}
                          onClick={() => handleSubmit(suggestion.action)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
                        >
                          <suggestion.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 leading-tight text-center">{suggestion.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Agent Tools */}
                    <div className="flex items-center justify-center gap-2 flex-wrap max-w-md mx-auto">
                      {AGENT_TOOLS.slice(0, 3).map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            if (tool.id === 'dump') {
                              setInput('/dump ');
                              inputRef.current?.focus();
                            } else {
                              handleSubmit(tool.label);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                        >
                          <tool.icon className="w-3 h-3" />
                          {tool.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 mt-0.5 shadow-amber-glow/50">
                      <Brain className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-[88%] md:max-w-[78%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    {msg.role === 'user' ? (
                      <div
                        className="px-3.5 py-2 rounded-2xl bg-primary/10 text-primary text-sm leading-relaxed border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
                        onClick={() => handleEditMessage(i)}
                      >
                        {editingMessageIndex === i ? (
                          <div className="space-y-2" onClick={e => e.stopPropagation()}>
                            <textarea
                              autoFocus
                              value={editMessageContent}
                              onChange={e => setEditMessageContent(e.target.value)}
                              className="w-full bg-transparent text-sm text-primary outline-none resize-none"
                              rows={3}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
                                if (e.key === 'Escape') setEditingMessageIndex(null);
                              }}
                            />
                            <div className="flex items-center gap-1.5">
                              <button onClick={handleSaveEdit} className="px-2 py-1 rounded-md bg-primary text-black text-xs font-medium">Save</button>
                              <button onClick={() => setEditingMessageIndex(null)} className="px-2 py-1 rounded-md text-zinc-400 hover:text-white text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-sm text-zinc-200 leading-relaxed [&_pre]:bg-zinc-900 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:my-2 [&_pre]:overflow-x-auto [&_code]:text-primary [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/[0.06] [&_th]:p-2 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-zinc-300 [&_th]:bg-white/[0.03] [&_td]:border [&_td]:border-white/[0.06] [&_td]:p-2 [&_td]:text-xs [&_td]:text-zinc-400 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:text-zinc-400 [&_blockquote]:italic [&_blockquote]:my-1 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_li>p]:inline [&_strong]:text-white [&_strong]:font-semibold]">
                          <StreamingContent content={msg.content} isStreaming={isStreaming && i === messages.length - 1} />
                        </div>

                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="pt-0.5">
                            <details className="group">
                              <summary className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors list-none">
                                <BookOpen className="w-3 h-3" />
                                <span>{msg.sources.length} source{msg.sources.length !== 1 ? 's' : ''}</span>
                                <ChevronDown className="w-2.5 h-2.5 group-open:rotate-180 transition-transform" />
                              </summary>
                              <div className="mt-1.5 space-y-1">
                                {msg.sources.map((source, si) => (
                                  <div key={si} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-[11px] font-medium text-primary truncate">{source.title}</span>
                                      <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                                        {(source.score * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{source.content}</p>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}

                        {/* Actions */}
                        {!isStreaming && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopy(msg.content, i)} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all" title="Copy">
                              {copiedIndex === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                            {i === messages.length - 1 && (
                              <button onClick={handleRegenerate} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all" title="Regenerate">
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            )}
                            <button onClick={() => handleCopy(msg.content, i)} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all" title="Share">
                              <Share2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Continue generating */}
              {!isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
                <div className="flex justify-center">
                  <button
                    onClick={handleContinueGeneration}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all border border-white/[0.06]"
                  >
                    <Plus className="w-3 h-3" />
                    Continue generating
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-white/[0.06] bg-[#0A0A0A]/90 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-2.5">
            <div className="flex items-end gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 focus-within:border-primary/30 focus-within:bg-white/[0.05] transition-all">
              <button
                onClick={() => setShowMobileToolbar(!showMobileToolbar)}
                className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all shrink-0 sm:hidden"
              >
                <Plus className="w-4 h-4" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your knowledge anything... (⌘K for tools)"
                rows={1}
                className="flex-1 bg-transparent text-sm text-white outline-none resize-none placeholder:text-zinc-600 max-h-32 scrollbar-hide"
                disabled={isStreaming}
              />
              {input.trim() && creditEstimate > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-zinc-500">
                  <DollarSign className="w-2.5 h-2.5" />
                  ~{creditEstimate}
                </div>
              )}
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isStreaming}
                className="p-1.5 rounded-lg bg-primary text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-light transition-all active:scale-95 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-zinc-700">
                AI responds from your knowledge only
              </p>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-700">
                <span>⌘N new</span>
                <span>⌘K tools</span>
                <span>⌘B sidebar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Panel */}
        {knowledgePanel && (
          <aside
            className="h-dvh border-l border-white/[0.06] bg-[#0A0A0A] overflow-hidden shrink-0 hidden lg:block w-[300px]"
          >
            <div className="w-[300px] h-full flex flex-col">
              <div className="flex items-center justify-between px-3 h-12 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-white">Knowledge</span>
                </div>
                <button onClick={() => setKnowledgePanel(false)} className="p-1 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {!hasKnowledge ? (
                  <div className="text-center py-10">
                    <FileText className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-600">No knowledge uploaded yet</p>
                    <Link href="/dashboard/knowledge" className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/15 transition-all">
                      <Plus className="w-3 h-3" /> Upload
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/dashboard/knowledge" className="flex items-center justify-between p-2.5 rounded-lg bg-primary/[0.05] border border-primary/20 hover:bg-primary/[0.08] transition-all">
                      <div className="flex items-center gap-2">
                        <Plus className="w-3 h-3 text-primary" />
                        <span className="text-[11px] font-medium text-primary">Upload new</span>
                      </div>
                      <ExternalLink className="w-2.5 h-2.5 text-primary/60" />
                    </Link>
                    <div className="space-y-1.5">
                      {(knowledge as Array<{ _id: string; title: string; content: string; createdAt: number; sourceType?: string }>).slice(0, 15).map(item => (
                        <div key={item._id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <FileText className="w-3 h-3 text-primary shrink-0" />
                            <span className="text-[11px] font-medium text-white truncate">{item.title}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{item.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-zinc-600">{new Date(item.createdAt).toLocaleDateString()}</span>
                            {item.sourceType && (
                              <span className="text-[9px] px-1 py-0.5 rounded-full bg-white/[0.04] text-zinc-500">{item.sourceType}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {(knowledge as Array<any>).length > 15 && (
                      <Link href="/dashboard/knowledge" className="block text-center text-[10px] text-primary/60 hover:text-primary py-2 transition-colors">
                        View all {knowledge.length} items
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
      </aside>
        )}
    </div>
  );
}

function StreamingContent({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  if (!content) return null;
  return (
    <>
      <MarkdownRenderer content={content} />
      {isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse align-text-bottom" />}
    </>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`}>
            <code>{codeContent}</code>
          </pre>
        );
        codeContent = '';
        codeLang = '';
      } else {
        codeLang = line.trim().slice(3).trim();
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line;
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      return;
    }

    const processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i}>{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="list-disc ml-4 text-sm text-zinc-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="list-decimal ml-5 text-sm text-zinc-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\.\s/, '') }} />
        </li>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i}>
          <span dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
        </blockquote>
      );
    } else if (/^\|.+\|/.test(line.trim())) {
      // Table row - skip for now (rendered via CSS on parent)
      elements.push(
        <p key={i} className="text-sm text-zinc-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
        </p>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm text-zinc-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
        </p>
      );
    }
  });

  if (inCodeBlock && codeContent) {
    elements.push(
      <pre key="code-end">
        <code>{codeContent}</code>
      </pre>
    );
  }

  return <>{elements}</>;
}

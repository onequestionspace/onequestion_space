'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, Search, Trash2, PanelRightOpen, PanelRightClose,
  Send, Copy, Check, RotateCcw, Share2, ChevronDown, BookOpen,
  Sparkles, Brain, Zap, FileText, Star, Settings, ChevronLeft,
  Menu, X, RefreshCw, Clock, Quote, ExternalLink,
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

const WELCOME_EXAMPLES = [
  'Summarize my startup vision',
  'Find everything about pricing',
  'Rewrite my bio',
  'What have I uploaded about marketing?',
  'Explain my roadmap',
  'Generate an X thread',
];

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chats = useQuery(api.chats.getChatsByUserId, userId ? { userId } : 'skip');
  const chatMessages = useQuery(api.chats.getChatMessages, activeChatId ? { chatId: activeChatId } : 'skip');
  const knowledge = useQuery(api.knowledge.getKnowledgeByUserId, userId ? { userId } : 'skip');

  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);
  const renameChat = useMutation(api.chats.renameChat);
  const addMessage = useMutation(api.chats.addMessage);

  const sortedChats = (chats as Array<{ _id: Id<'chats'>; userId: string; title: string; createdAt: number; updatedAt: number }> | undefined)?.slice().sort((a, b) => b.updatedAt - a.updatedAt) || [];

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
    document.title = 'Chat Your Knowledge - One Question';
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming || !userId) return;

    let chatId = activeChatId;
    const userMessage = input.trim();
    setInput('');

    if (!chatId) {
      const title = userMessage.length > 50 ? userMessage.slice(0, 50) + '...' : userMessage;
      chatId = await createChat({ userId, title });
      setActiveChatId(chatId);
    }

    const userMsg: Message = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userMessage,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    setIsStreaming(true);
    await addMessage({ chatId, role: 'user', content: userMessage });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/chat-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage, userId }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          createdAt: Date.now(),
        }]);
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let sources: Source[] = [];

      const assistantMsg: Message = {
        id: 'stream-' + Date.now(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'content') {
              fullContent += data.text;
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.id === assistantMsg.id) {
                  updated[updated.length - 1] = { ...last, content: fullContent };
                }
                return updated;
              });
            } else if (data.type === 'done') {
              sources = data.sources || [];
            }
          } catch {}
        }
      }

      if (fullContent) {
        await addMessage({
          chatId,
          role: 'assistant',
          content: fullContent,
          sources: sources.length > 0 ? sources : undefined,
        });

        if (chatId === activeChatId) {
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.id === assistantMsg.id) {
              const dbMsg = chatMessages?.find(m => m.role === 'assistant' && m.content === fullContent);
              if (dbMsg) {
                updated[updated.length - 1] = {
                  ...last,
                  id: dbMsg._id,
                  sources: dbMsg.sources,
                };
              }
            }
            return updated;
          });
        }
      }

      // Auto-rename if first message
      const chat = chats?.find(c => c._id === chatId);
      if (chat && chat.title === 'New conversation') {
        const newTitle = fullContent.length > 60
          ? fullContent.replace(/[#*_~`]/g, '').trim().slice(0, 60) + '...'
          : fullContent.replace(/[#*_~`]/g, '').trim();
        await renameChat({ id: chatId, title: newTitle });
      }
    } catch {
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        createdAt: Date.now(),
      }]);
    }
    setIsStreaming(false);
  };

  const handleRegenerate = async () => {
    if (messages.length < 2 || isStreaming || !activeChatId || !userId) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    setMessages(prev => prev.slice(0, -1));
    setIsStreaming(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/chat-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: lastUserMsg.content, userId }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok || !res.body) {
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      const assistantMsg: Message = {
        id: 'stream-' + Date.now(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'content') {
              fullContent += data.text;
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.id === assistantMsg.id) {
                  updated[updated.length - 1] = { ...last, content: fullContent };
                }
                return updated;
              });
            }
          } catch {}
        }
      }

      if (fullContent) {
        await addMessage({ chatId: activeChatId, role: 'assistant', content: fullContent });
      }
    } catch {
      setIsStreaming(false);
    }
    setIsStreaming(false);
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-zinc-600 text-sm">Loading...</p>
      </div>
    </div>
  );
  if (!isSignedIn) { redirect('/'); }

  const firstName = user?.firstName || user?.username || 'there';

  const filteredChats = sortedChats.filter((c: { title: string }) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasKnowledge = knowledge && knowledge.length > 0;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {showMobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 300 : 0 }}
        className={`h-screen bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col shrink-0 overflow-hidden
          ${showMobileSidebar ? 'fixed left-0 top-0 z-50 w-[300px]' : 'hidden lg:flex'}`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-amber-glow">
              <MessageSquare className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-bold text-white">
              One<span className="text-primary">Question</span>
            </span>
          </div>
          <button
            onClick={() => { setSidebarOpen(false); setShowMobileSidebar(false); }}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-black text-sm font-semibold hover:bg-primary-light transition-all shadow-amber-glow hover:shadow-amber-glow-lg active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="px-3 mb-2">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 focus-within:border-primary/30 transition-all">
            <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4 space-y-0.5 scrollbar-hide">
          {filteredChats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all ${
                  activeChatId === chat._id
                    ? 'bg-primary/[0.08] text-primary'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
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
                    className="flex-1 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs text-white outline-none"
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="flex-1 truncate text-xs"
                    onDoubleClick={() => {
                      setEditingChatId(chat._id);
                      setEditTitle(chat.title);
                    }}
                  >
                    {chat.title}
                  </span>
                )}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChatId(chat._id);
                      setEditTitle(chat.title);
                    }}
                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-3 space-y-1">
          {[
            { icon: BookOpen, label: 'Knowledge Library', href: '/dashboard/knowledge' },
            { icon: Star, label: 'Starred', href: '#' },
            { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all"
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </a>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-white">Chat Your Knowledge</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setKnowledgePanel(!knowledgePanel)}
              className={`p-2 rounded-lg transition-all ${
                knowledgePanel ? 'text-primary bg-primary/[0.08]' : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Knowledge Panel"
            >
              {knowledgePanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          {messages.length === 0 ? (
            // Welcome state
            <div className="h-full flex flex-col items-center justify-center px-4 py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-amber-glow">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {getGreeting()}, {firstName}.
                </h1>
                <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                  What do you want to know from your own knowledge?
                </p>

                {!hasKnowledge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">Your AI has nothing to learn yet.</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                      Upload your first document to start chatting with your knowledge.
                    </p>
                    <a
                      href="/dashboard/knowledge"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-black text-xs font-semibold hover:bg-primary-light transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload your first document
                    </a>
                  </motion.div>
                )}

                {hasKnowledge && (
                  <div className="space-y-2 max-w-sm mx-auto">
                    {WELCOME_EXAMPLES.map((example, i) => (
                      <motion.button
                        key={example}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        onClick={() => {
                          setInput(example);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                          {example}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    {msg.role === 'user' ? (
                      <div className="px-4 py-2.5 rounded-2xl bg-primary text-black text-sm leading-relaxed shadow-amber-glow">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="prose prose-invert prose-sm max-w-none text-zinc-200 leading-relaxed">
                          <StreamingContent content={msg.content} isStreaming={isStreaming && i === messages.length - 1} />
                        </div>

                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="pt-1">
                            <details className="group">
                              <summary className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors list-none">
                                <BookOpen className="w-3 h-3" />
                                <span>{msg.sources.length} source{msg.sources.length !== 1 ? 's' : ''}</span>
                                <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                              </summary>
                              <div className="mt-2 space-y-1.5">
                                {msg.sources.map((source, si) => (
                                  <div
                                    key={si}
                                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-primary">{source.title}</span>
                                      <span className="text-[10px] text-zinc-600">
                                        {(source.score * 100).toFixed(0)}% match
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                                      {source.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}

                        {/* Actions */}
                        {!isStreaming && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                              title="Copy"
                            >
                              {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            {i === messages.length - 1 && (
                              <button
                                onClick={handleRegenerate}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                                title="Regenerate"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                              title="Share"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-white/[0.06] bg-background/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-end gap-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-primary/30 focus-within:bg-white/[0.05] transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your knowledge anything..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-white outline-none resize-none placeholder:text-zinc-600 max-h-32 scrollbar-hide"
                disabled={isStreaming}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-xl bg-primary text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-light transition-all active:scale-95 shrink-0 shadow-amber-glow"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-700 text-center mt-1.5">
              AI responds based only on your uploaded knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge Panel */}
      <AnimatePresence>
        {knowledgePanel && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-screen border-l border-white/[0.06] bg-[#0A0A0A] overflow-hidden shrink-0 hidden lg:block"
          >
            <div className="w-[320px] h-full flex flex-col">
              <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-white">Knowledge</span>
                </div>
                <button
                  onClick={() => setKnowledgePanel(false)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {!hasKnowledge ? (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-600">No knowledge uploaded yet</p>
                  </div>
                ) : (
                  <>
                    <a
                      href="/dashboard/knowledge"
                      className="flex items-center justify-between p-3 rounded-xl bg-primary/[0.05] border border-primary/20 hover:bg-primary/[0.08] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-primary">Upload new</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-primary/60" />
                    </a>

                    <div className="space-y-2">
                      {knowledge.slice(0, 10).map(item => (
                        <div
                          key={item._id}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs font-medium text-white truncate">{item.title}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{item.content}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-zinc-600">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            {item.sourceType && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-500">
                                {item.sourceType}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function StreamingContent({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  if (!content) return null;
  return (
    <>
      {renderMarkdown(content)}
      {isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/70 ml-0.5 animate-pulse align-text-bottom" />}
    </>
  );
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-zinc-900 rounded-xl p-4 overflow-x-auto text-xs text-zinc-200 border border-white/[0.06] my-2">
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
      .replace(/`(.*?)`/g, '<code class="bg-zinc-800 px-1 py-0.5 rounded text-xs text-primary">$1</code>');

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-sm font-bold text-white mt-4 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-base font-bold text-white mt-5 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-lg font-bold text-white mt-5 mb-2">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-sm text-zinc-200">
          <span className="text-primary/70 mt-1.5 shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-sm text-zinc-200">
          <span className="text-primary/70 shrink-0 font-medium">{line.match(/^\d+/)?.[0]}.</span>
          <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\.\s/, '') }} />
        </div>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-primary/40 pl-3 py-1 text-sm text-zinc-400 italic my-1">
          <span dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />
        </blockquote>
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
      <pre key="code-end" className="bg-zinc-900 rounded-xl p-4 overflow-x-auto text-xs text-zinc-200 border border-white/[0.06] my-2">
        <code>{codeContent}</code>
      </pre>
    );
  }

  return <>{elements}</>;
}

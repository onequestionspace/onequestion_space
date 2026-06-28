'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Plus, Trash2, Eye, EyeOff, Edit3, Save, X } from 'lucide-react';

export default function BlogsDashboard() {
  const { user } = useUser();
  const blogs = useQuery(api.blogs.getAllBlogs);
  const createBlog = useMutation(api.blogs.createBlog);
  const updateBlog = useMutation(api.blogs.updateBlog);
  const deleteBlog = useMutation(api.blogs.deleteBlog);

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', tags: '', published: false });
  const [saving, setSaving] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    await createBlog({
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      author: user?.fullName || user?.username || 'Asym Alwali',
      published: form.published,
    });
    setForm({ title: '', slug: '', excerpt: '', content: '', tags: '', published: false });
    setIsCreating(false);
    setSaving(false);
  };

  const handleTogglePublish = async (blog: any) => {
    await updateBlog({ id: blog._id, published: !blog.published });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await deleteBlog({ id: id as any });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
            <p className="text-muted-foreground text-sm">Write and publish posts for the Knowledge Explorer</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {isCreating && (
          <div className="glass rounded-2xl p-5 border border-amber-500/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">New Post</h2>
              <button onClick={() => setIsCreating(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="Title"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50"
              />
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="slug (auto-generated)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50"
              />
              <input
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short excerpt shown in blog list"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50"
              />
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write your post here. Separate paragraphs with blank lines."
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 resize-none"
              />
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="Tags: bootstrapping, AI, building in public"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                    className="accent-amber-500"
                  />
                  Publish immediately
                </label>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.title || !form.content}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {blogs === undefined && (
            <div className="text-center py-12 text-muted-foreground text-sm">Loading posts...</div>
          )}
          {blogs && blogs.length === 0 && !isCreating && (
            <div className="glass rounded-2xl p-8 border border-white/10 text-center">
              <Edit3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No posts yet</p>
              <p className="text-muted-foreground text-sm">Write your first post to share your journey.</p>
            </div>
          )}
          {blogs && blogs.map((blog) => (
            <div key={blog._id} className="glass rounded-2xl p-4 border border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{blog.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {blog.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-1">{blog.excerpt}</p>
                  <p className="text-muted-foreground text-xs mt-1 font-mono">/{blog.slug}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleTogglePublish(blog)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title={blog.published ? 'Unpublish' : 'Publish'}>
                    {blog.published ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <button onClick={() => handleDelete(blog._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

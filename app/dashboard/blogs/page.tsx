'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader } from '@/components/dashboard/Card';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Badge } from '@/components/dashboard/Badge';
import { Input, Textarea } from '@/components/dashboard/Input';
import { Button } from '@/components/dashboard/Button';
import { ListSkeleton } from '@/components/dashboard/Skeleton';
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
    <DashboardLayout title="Blog Posts" description="Write and publish posts for the Knowledge Explorer.">
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">{blogs?.length ?? 0} post{(blogs?.length ?? 0) !== 1 ? 's' : ''}</p>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} icon={<Plus className="w-4 h-4" />}>
              New Post
            </Button>
          )}
        </div>

        {isCreating && (
          <div>
            <Card className="border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">New Post</h3>
                <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="Title"
                />
                <Input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="slug (auto-generated)"
                />
                <Input
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short excerpt shown in blog list"
                />
                <Textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your post here."
                  rows={10}
                />
                <Input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="Tags: bootstrapping, AI, building in public"
                />
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                      className="accent-amber-500"
                    />
                    Publish immediately
                  </label>
                  <Button
                    onClick={handleCreate}
                    loading={saving}
                    disabled={!form.title || !form.content}
                    icon={<Save className="w-4 h-4" />}
                  >
                    {saving ? 'Saving...' : 'Save Post'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="space-y-3">
          {blogs === undefined && <ListSkeleton rows={4} />}
          {blogs && blogs.length === 0 && !isCreating && (
            <EmptyState
              icon={<Edit3 />}
              title="No posts yet"
              description="Write your first post to share your journey."
              action={
                <Button onClick={() => setIsCreating(true)} variant="primary">
                  Create your first post
                </Button>
              }
            />
          )}
          {blogs && blogs.map((blog) => (
            <div key={blog._id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.05] hover:border-white/[0.12]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{blog.title}</h3>
                    <Badge variant={blog.published ? 'success' : 'warning'}>{blog.published ? 'Live' : 'Draft'}</Badge>
                  </div>
                  <p className="text-zinc-500 text-xs line-clamp-1">{blog.excerpt}</p>
                  <p className="text-zinc-600 text-xs mt-1 font-mono">/{blog.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleTogglePublish(blog)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title={blog.published ? 'Unpublish' : 'Publish'}>
                    {blog.published ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  <button onClick={() => handleDelete(blog._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

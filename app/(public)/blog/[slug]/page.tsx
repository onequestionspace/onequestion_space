'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams();
  const blog = useQuery(api.blogs.getBlogBySlug, { slug: slug as string });

  if (blog === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'0ms'}} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'150ms'}} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay:'300ms'}} />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
          <Link href="/blog" className="text-primary text-sm hover:underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
      </div>

      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <article className="glass rounded-2xl p-6 border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{blog.title}</h1>

            <div className="flex items-center flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                {blog.author}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  {blog.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {blog.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">{para}</p>
              ))}
            </div>
          </article>

          <div className="mt-6 glass rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-muted-foreground text-sm mb-3">Have questions about this post?</p>
            <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Ask the Knowledge Explorer
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

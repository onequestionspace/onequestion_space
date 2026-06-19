const fs = require('fs');

let blog = fs.readFileSync('app/blog/page.tsx', 'utf8');

// Add useUser import
if (!blog.includes('useUser')) {
  blog = blog.replace(
    `import { useQuery } from 'convex/react';`,
    `import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';`
  );
}

// Add useUser hook inside component
blog = blog.replace(
  `  const blogs = useQuery(api.blogs.getPublishedBlogs);`,
  `  const { isSignedIn } = useUser();
  const blogs = useQuery(api.blogs.getPublishedBlogs);`
);

// Add write button next to "From the Blog" heading
blog = blog.replace(
  `              <h2 className="text-lg font-bold text-white">From the Blog</h2>
              <span className="text-xs text-muted-foreground">Latest posts</span>`,
  `              <h2 className="text-lg font-bold text-white">From the Blog</h2>
              {isSignedIn ? (
                <Link href="/dashboard/blogs" className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                  + Write a post
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">Latest posts</span>
              )}`
);

fs.writeFileSync('app/blog/page.tsx', blog);
console.log('✓ Added Write a post button');

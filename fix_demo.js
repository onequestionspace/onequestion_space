const fs = require('fs');
let content = fs.readFileSync('components/Hero.tsx', 'utf8');

// Add useEffect to imports
content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);

// Replace the entire demo div
const oldDemo = `          <div className="relative max-w-2xl mx-auto">
            <div className="glass rounded-3xl p-6 text-left card-hover">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">
                  AI Conversation Demo
                </h3>

                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary-light border border-primary/30">
                  Live
                </span>
              </div>

              <div className="space-y-4">

                <div className="flex justify-end">
                  <div className="max-w-[90%] sm:max-w-[80%] bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      Visitor
                    </p>
                    <p className="text-white">
                      What do you do?
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[90%] sm:max-w-[80%] bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
                    <p className="text-sm text-primary-light mb-1">
                      AI
                    </p>
                    <p className="text-white">
                      I help founders turn their knowledge into an AI assistant that answers questions automatically.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[90%] sm:max-w-[80%] bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      Visitor
                    </p>
                    <p className="text-white">
                      How can I contact you?
                    </p>
                  </div>
                </div>`;

const newDemo = `          <div className="relative max-w-2xl mx-auto">
            <AnimatedDemo />
            <div className="hidden">`;

content = content.replace(oldDemo, newDemo);

fs.writeFileSync('components/Hero.tsx', content);
console.log('Done');

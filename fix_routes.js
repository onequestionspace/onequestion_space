const fs = require('fs');

// Fix 1 - remove createdAt and updatedAt from knowledge POST
let knowledge = fs.readFileSync('app/api/knowledge/route.ts', 'utf8');
knowledge = knowledge.replace(
      `      userId,
      title,
      content,
      embeddings: embeddings.length > 0 ? embeddings : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),`,
      `      userId,
      title,
      content,
      embeddings: embeddings.length > 0 ? embeddings : undefined,`
);
fs.writeFileSync('app/api/knowledge/route.ts', knowledge);
console.log('Knowledge route fixed');

// Fix 2 - upload route uses wrong mutation name
let upload = fs.readFileSync('app/api/upload/route.ts', 'utf8');
upload = upload.replace(
  `await convex.mutation(api.knowledge.create, {
      userId,
      filename: file.name,
      content,
      fileType,
    });`,
  `await convex.mutation(api.knowledge.createKnowledge, {
      userId,
      title: file.name,
      content,
      fileType,
    });`
);
fs.writeFileSync('app/api/upload/route.ts', upload);
console.log('Upload route fixed');

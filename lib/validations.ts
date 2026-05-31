/**
 * Validation functions for form inputs and API requests
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationError | null {
  if (!username || username.trim().length === 0) {
    return { field: 'username', message: 'Username is required' };
  }
  if (username.length < 3) {
    return { field: 'username', message: 'Username must be at least 3 characters' };
  }
  if (username.length > 30) {
    return { field: 'username', message: 'Username must be less than 30 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { field: 'username', message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  return null;
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationError | null {
  if (!password || password.length === 0) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters' };
  }
  return null;
}

/**
 * Validate question
 */
export function validateQuestion(question: string): ValidationError | null {
  if (!question || question.trim().length === 0) {
    return { field: 'question', message: 'Question is required' };
  }
  if (question.length < 5) {
    return { field: 'question', message: 'Question must be at least 5 characters' };
  }
  if (question.length > 500) {
    return { field: 'question', message: 'Question must be less than 500 characters' };
  }
  return null;
}

/**
 * Validate knowledge title
 */
export function validateKnowledgeTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'title', message: 'Title is required' };
  }
  if (title.length < 3) {
    return { field: 'title', message: 'Title must be at least 3 characters' };
  }
  if (title.length > 100) {
    return { field: 'title', message: 'Title must be less than 100 characters' };
  }
  return null;
}

/**
 * Validate knowledge content
 */
export function validateKnowledgeContent(content: string): ValidationError | null {
  if (!content || content.trim().length === 0) {
    return { field: 'content', message: 'Content is required' };
  }
  if (content.length < 10) {
    return { field: 'content', message: 'Content must be at least 10 characters' };
  }
  if (content.length > 50000) {
    return { field: 'content', message: 'Content must be less than 50,000 characters' };
  }
  return null;
}

/**
 * Validate file
 */
export function validateFile(file: File | null): ValidationError | null {
  if (!file) {
    return null; // File is optional
  }
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { field: 'file', message: 'File size must be less than 10MB' };
  }
  const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
  if (!allowedTypes.includes(file.type)) {
    return { field: 'file', message: 'File type must be PDF, TXT, or MD' };
  }
  return null;
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'displayName', message: 'Display name is required' };
  }
  if (name.length < 2) {
    return { field: 'displayName', message: 'Display name must be at least 2 characters' };
  }
  if (name.length > 50) {
    return { field: 'displayName', message: 'Display name must be less than 50 characters' };
  }
  return null;
}

/**
 * Validate bio
 */
export function validateBio(bio: string): ValidationError | null {
  if (bio && bio.length > 200) {
    return { field: 'bio', message: 'Bio must be less than 200 characters' };
  }
  return null;
}

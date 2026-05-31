// User Profile
export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

// Knowledge Base
export interface Knowledge {
  id: string;
  userId: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: number;
  updatedAt: number;
}

// Question
export interface Question {
  id: string;
  profileId: string;
  visitorId?: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
  createdAt: number;
  answeredAt?: number;
}

// Analytics
export interface Analytics {
  id: string;
  profileId: string;
  totalQuestions: number;
  totalAnswers: number;
  totalVisitors: number;
  createdAt: number;
  updatedAt: number;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  paymentReference?: string;
  amount?: number;
  currency?: string;
  renewalDate?: number;
  createdAt: number;
  updatedAt: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Ask Question Request
export interface AskQuestionRequest {
  question: string;
  visitorName?: string;
  visitorEmail?: string;
}

// Upload Knowledge Request
export interface UploadKnowledgeRequest {
  title: string;
  content: string;
  file?: File;
}

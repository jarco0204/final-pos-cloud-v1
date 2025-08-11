export interface AIMetadata {
  timestamp: string;
  requestId: string;
  processingTime: number;
  apiVersion: string;
  endpoint: string;
  method: string;
  userId?: string;
  sessionId?: string;
}

export interface AIHint {
  type: 'info' | 'warning' | 'suggestion' | 'tip';
  message: string;
  code?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AINextStep {
  action: string;
  description: string;
  endpoint?: string;
  method?: string;
  requiredParams?: string[];
  optionalParams?: string[];
  example?: any;
}

export interface AIEcho {
  input?: any;
  parameters?: Record<string, any>;
  filters?: Record<string, any>;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  sorting?: {
    field?: string;
    order?: 'asc' | 'desc';
  };
}

export interface AIResponse<T = any> {
  success: boolean;
  data: T;
  metadata: AIMetadata;
  hints?: AIHint[];
  nextSteps?: AINextStep[];
  echo?: AIEcho;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AIPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AIPaginatedResponse<T = any> extends AIResponse<T[]> {
  pagination: AIPaginationMeta;
}

import {
  AIResponse,
  AIMetadata,
  AIHint,
  //   AINextStep,
  AIEcho,
  AIPaginatedResponse,
  AIPaginationMeta,
} from '../types/ai-response.types';

export class AIResponseBuilder<T = any> {
  private response: Partial<AIResponse<T>> = {
    success: true,
    metadata: {} as AIMetadata,
  };

  constructor(
    private endpoint: string,
    private method: string,
    private requestId: string,
    private startTime: number = Date.now(),
  ) {
    this.response.metadata = {
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      processingTime: Date.now() - this.startTime,
      apiVersion: '1.0.0',
      endpoint: this.endpoint,
      method: this.method,
    };
  }

  setData(data: T): this {
    this.response.data = data;
    return this;
  }

  setSuccess(success: boolean): this {
    this.response.success = success;
    return this;
  }

  setError(code: string, message: string, details?: any): this {
    this.response.success = false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.response.error = { code, message, details };
    return this;
  }

  addHint(
    type: AIHint['type'],
    message: string,
    priority: AIHint['priority'] = 'low',
    code?: string,
  ): this {
    if (!this.response.hints) {
      this.response.hints = [];
    }
    this.response.hints.push({ type, message, priority, code });
    return this;
  }

  addNextStep(
    action: string,
    description: string,
    endpoint?: string,
    method?: string,
    requiredParams?: string[],
    optionalParams?: string[],
    example?: any,
  ): this {
    if (!this.response.nextSteps) {
      this.response.nextSteps = [];
    }
    this.response.nextSteps.push({
      action,
      description,
      endpoint,
      method,
      requiredParams,
      optionalParams,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      example,
    });
    return this;
  }

  setEcho(
    input?: any,
    parameters?: Record<string, any>,
    filters?: Record<string, any>,
    pagination?: AIEcho['pagination'],
    sorting?: AIEcho['sorting'],
  ): this {
    this.response.echo = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      input,
      parameters,
      filters,
      pagination,
      sorting,
    };
    return this;
  }

  setUserContext(userId?: string, sessionId?: string): this {
    if (this.response.metadata) {
      this.response.metadata.userId = userId;
      this.response.metadata.sessionId = sessionId;
    }
    return this;
  }

  build(): AIResponse<T> {
    // Update processing time
    if (this.response.metadata) {
      this.response.metadata.processingTime = Date.now() - this.startTime;
    }

    return this.response as AIResponse<T>;
  }

  buildPaginated(
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): AIPaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    const pagination: AIPaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    this.setData(data as any);

    return {
      ...this.build(),
      pagination,
    } as AIPaginatedResponse<T>;
  }
}

// Helper function to create AI response builder
export function createAIResponse<T = any>(
  endpoint: string,
  method: string,
  requestId: string,
  startTime?: number,
): AIResponseBuilder<T> {
  return new AIResponseBuilder<T>(endpoint, method, requestId, startTime);
}

// Common hints for different scenarios
export const CommonHints = {
  pagination: (page: number, limit: number) => ({
    type: 'info' as const,
    message: `Showing page ${page} with ${limit} items per page. Use pagination parameters to navigate.`,
    priority: 'low' as const,
  }),

  filtering: (filters: Record<string, any>) => ({
    type: 'info' as const,
    message: `Results filtered by: ${Object.keys(filters).join(', ')}`,
    priority: 'low' as const,
  }),

  sorting: (field: string, order: 'asc' | 'desc') => ({
    type: 'info' as const,
    message: `Results sorted by ${field} in ${order}ending order`,
    priority: 'low' as const,
  }),

  emptyResults: () => ({
    type: 'warning' as const,
    message:
      'No results found for the given criteria. Try adjusting your filters or search terms.',
    priority: 'medium' as const,
  }),

  rateLimit: (remaining: number) => ({
    type: 'warning' as const,
    message: `Rate limit: ${remaining} requests remaining`,
    priority: 'high' as const,
  }),
};

// Common next steps for different endpoints
export const CommonNextSteps = {
  createProduct: () => ({
    action: 'Create Product',
    description: 'Add a new product to the inventory',
    endpoint: '/product',
    method: 'POST',
    requiredParams: ['name', 'price', 'stock', 'image'],
    optionalParams: ['description'],
  }),

  updateProduct: (id: string) => ({
    action: 'Update Product',
    description: 'Modify an existing product',
    endpoint: `/product/${id}`,
    method: 'PUT',
    requiredParams: [],
    optionalParams: ['name', 'description', 'price', 'stock', 'image'],
  }),

  deleteProduct: (id: string) => ({
    action: 'Delete Product',
    description: 'Remove a product from inventory',
    endpoint: `/product/${id}`,
    method: 'DELETE',
  }),

  getProduct: (id: string) => ({
    action: 'Get Product Details',
    description: 'Retrieve detailed information about a specific product',
    endpoint: `/product/${id}`,
    method: 'GET',
  }),

  listProducts: () => ({
    action: 'List Products',
    description: 'Get all products with optional filtering and pagination',
    endpoint: '/product',
    method: 'GET',
    optionalParams: ['page', 'limit', 'sort', 'filter'],
  }),
};

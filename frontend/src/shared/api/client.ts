export interface ApiValidationError {
  code: string;
  message: string;
  field?: string | null;
}

export interface ApiErrorBody {
  status: number;
  message: string;
  error: {
    code: string;
    message: string;
    errors?: ApiValidationError[];
  };
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: ApiValidationError[];

  constructor(
    status: number,
    message: string,
    code = "HTTP_ERROR",
    errors: ApiValidationError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function transformKeys<T>(value: T, transformKey: (key: string) => string): T {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformKey)) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        transformKey(key),
        transformKeys(entry, transformKey),
      ]),
    ) as T;
  }

  return value;
}

function toSnakeCase<T>(value: T): T {
  return transformKeys(value, camelToSnake);
}

function toCamelCase<T>(value: T): T {
  return transformKeys(value, snakeToCamel);
}

function parseApiError(status: number, body: unknown): ApiError {
  if (!body || typeof body !== "object") {
    return new ApiError(status, "Request failed");
  }

  const value = body as Partial<ApiErrorBody>;
  const error = value.error;

  if (error && typeof error.message === "string") {
    return new ApiError(status, error.message, error.code ?? "HTTP_ERROR", error.errors ?? []);
  }

  // Fallback for unexpected responses, such as proxy or server errors.
  return new ApiError(status, typeof value.message === "string" ? value.message : "Request failed");
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw parseApiError(res.status, body);
  }

  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new ApiError(res.status, "The server returned an invalid API response.");
  }

  return {
    status: body.status,
    message: body.message,
    data: toCamelCase(body.data) as T,
  };
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(toSnakeCase(body)),
    }),

  put: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(toSnakeCase(body)),
    }),

  patch: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(toSnakeCase(body)),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};

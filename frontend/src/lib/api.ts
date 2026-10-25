const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  error?: { code?: string; message?: string };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  clientCode?: string;
  isActive: boolean;
};

export type Partner = {
  _id: string;
  name: string;
  email: string;
  role: "client";
  clientCode: string;
  isActive: boolean;
  createdAt: string;
};

export type WasteEntry = {
  _id: string;
  clientId: string | { _id: string; name: string; email: string; clientCode?: string };
  quantityKg: number;
  wasteDate: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
};

export type Paginated<T> = {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type PublicImpactSummary = {
  totalWasteKg: number;
  contributingClients: number;
  approvedEntries: number;
};

export type PublicImpactTrend = {
  period: string;
  totalWasteKg: number;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new ApiError("The API URL is not configured.", 0);
  }

  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Could not reach the Recrema API. Check that the backend is running.", 0);
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    const message = response.status >= 500
      ? "The server could not complete the request. Please try again."
      : payload?.error?.message || "The request could not be completed.";
    throw new ApiError(message, response.status, payload?.error?.code);
  }

  return payload;
}

function requireData<T>(response: ApiResponse<T>): T {
  if (response.data === undefined) {
    throw new ApiError("The server returned an incomplete response.", 502);
  }
  return response.data;
}

async function requestPage<T>(path: string): Promise<Paginated<T>> {
  const response = await request<T[]>(path);
  if (!Array.isArray(response.data)) {
    throw new ApiError("The server returned an invalid list response.", 502);
  }

  return {
    data: response.data,
    pagination: response.pagination ?? {
      page: 1,
      limit: response.data.length,
      total: response.data.length,
      totalPages: response.data.length ? 1 : 0,
    },
  };
}

export const api = {
  currentUser: async () => requireData(await request<{ user: User }>("/auth/me")).user,
  login: async (identifier: string, password: string) =>
    requireData(await request<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    })).user,
  logout: async () => requireData(await request<{ message: string }>("/auth/logout", { method: "POST" })),
  publicImpactSummary: async () => requireData(await request<PublicImpactSummary>("/insights")),
  publicImpactTrends: async () => {
    const trends = requireData(await request<PublicImpactTrend[]>("/insights/trends?period=monthly"));
    if (!Array.isArray(trends)) throw new ApiError("The server returned invalid impact trends.", 502);
    return trends;
  },
  myWasteEntries: (page = 1, limit = 20) =>
    requestPage<WasteEntry>(`/waste?page=${page}&limit=${limit}`),
  createWasteEntry: async (input: { quantityKg: number; wasteDate: string; notes?: string }) =>
    requireData(await request<WasteEntry>("/waste", { method: "POST", body: JSON.stringify(input) })),
  pendingWasteEntries: (page = 1, limit = 20) =>
    requestPage<WasteEntry>(`/admin/waste/pending?page=${page}&limit=${limit}`),
  partners: (page = 1, limit = 50, search = "") =>
    requestPage<Partner>(`/admin/partners?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),
  createPartner: async (input: { name: string; email: string; clientCode: string; password: string }) =>
    requireData(await request<Partner>("/admin/partners", { method: "POST", body: JSON.stringify(input) })),
  updatePartner: async (id: string, input: { name?: string; email?: string; clientCode?: string; password?: string }) =>
    requireData(await request<Partner>(`/admin/partners/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) })),
  updatePartnerStatus: async (id: string, isActive: boolean) =>
    requireData(await request<Partner>(`/admin/partners/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) })),
  removePartner: async (id: string) =>
    requireData(await request<Partner>(`/admin/partners/${encodeURIComponent(id)}`, { method: "DELETE" })),
  approveWasteEntry: async (id: string) =>
    requireData(await request<WasteEntry>(`/admin/waste/${encodeURIComponent(id)}/approve`, { method: "PATCH" })),
};

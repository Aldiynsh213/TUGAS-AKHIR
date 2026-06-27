const API_BASE = "http://localhost:5000/api";

class ApiClient {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }
  async get<T>(endpoint: string) { return this.request<T>(endpoint); }
  async post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }); }
  async put<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }); }
  async delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: "DELETE" }); }
}
export const api = new ApiClient();

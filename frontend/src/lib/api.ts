import { apiRoutes } from '../config/env'
import type {
  AdminLoginResponse,
  AdminProjectPayload,
  AdminSummary,
  CheckoutUserDetails,
  LeadPayload,
  PaymentOrderResponse,
  Project,
  ProjectDomain,
  VerifyPaymentPayload,
} from '../types/project'
import { http, jsonHeaders } from './http'
import { getAdminToken } from './auth'

const authHeaders = (): HeadersInit => {
  const token = getAdminToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export const projectApi = {
  list: () => http<Project[]>(apiRoutes.projects),
  domains: () => http<ProjectDomain[]>(apiRoutes.projectDomains),
  createDomain: (payload: Pick<ProjectDomain, 'name' | 'description'>) =>
    http<ProjectDomain>(apiRoutes.projectDomains, {
      method: 'POST',
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload),
    }),
}

export const leadApi = {
  create: (payload: LeadPayload) =>
    http(apiRoutes.userLeads, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
}

export const paymentApi = {
  createOrder: (amount: number, user?: CheckoutUserDetails) =>
    http<PaymentOrderResponse>(apiRoutes.payment.create, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ amount, user }),
    }),
  verifyPayment: (payload: VerifyPaymentPayload) =>
    http<{ downloadLink: string; paymentId: string; orderId: string }>(apiRoutes.payment.verify, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  sendDownloadLinks: (email: string) =>
    http<{ message: string }>(apiRoutes.payment.downloadLinks, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email }),
    }),
}

export const adminApi = {
  login: (email: string, password: string) =>
    http<AdminLoginResponse>(apiRoutes.admin.login, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email, password }),
    }),
  summary: () =>
    http<AdminSummary>(apiRoutes.admin.summary, {
      headers: { ...authHeaders() },
    }),
  listProjects: () =>
    http<Project[]>(apiRoutes.admin.projects, {
      headers: { ...authHeaders() },
    }),
  createProject: (payload: AdminProjectPayload) =>
    http<Project>(apiRoutes.admin.projects, {
      method: 'POST',
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  updateProject: (id: string, payload: Partial<AdminProjectPayload>) =>
    http<Project>(`${apiRoutes.admin.projects}/${id}`, {
      method: 'PUT',
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload),
    }),
  deleteProject: (id: string) =>
    http<{ message: string }>(`${apiRoutes.admin.projects}/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    }),
  createDomain: (payload: Pick<ProjectDomain, 'name' | 'description'>) =>
    http<ProjectDomain>(apiRoutes.projectDomains, {
      method: 'POST',
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload),
    }),
}

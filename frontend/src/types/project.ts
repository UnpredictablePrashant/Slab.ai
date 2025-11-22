export interface SubProject {
  projectName: string
  projectDescription: string
  toolsUsed: string[]
  timeToWorkOnProject?: number
}

export interface Project {
  _id: string
  projectTitle: string
  description: string
  imageUrl?: string
  pricing: number
  projectDomain?: string
  keyWords?: string[]
  noOfSubProjects?: number
  subProjects?: SubProject[]
  createdAt?: string
  updatedAt?: string
}

export interface ProjectDomain {
  _id: string
  name: string
  description?: string
}

export interface LeadPayload {
  name: string
  countryCode: string
  phoneNo: string
  email: string
}

export interface CheckoutUserDetails {
  name: string
  email: string
  phone: string
  projectId: string
  amount: number
}

export interface PaymentOrderResponse {
  id: string
  currency: string
  amount: number
}

export interface VerifyPaymentPayload {
  orderCreationId: string
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
  user: CheckoutUserDetails
}

export interface AdminSummary {
  totalProjects: number
  totalDomains: number
  totalContents: number
  recentProjects: Project[]
}

export interface AdminProjectPayload {
  projectTitle: string
  description: string
  imageUrl?: string
  pricing: number
  projectDomain: string
  keyWords?: string[]
  subProjects: SubProject[]
}

export interface AdminLoginResponse {
  token: string
}

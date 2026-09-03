/**
 * API Response Types
 * 
 * Type definitions for all backend API responses
 * Ensures type safety across the application
 */

import type {
  ReportCategory,
  ReportStatus,
  VerificationLevel,
  UserRole,
  AppealStatus,
  AppealReason,
  FlagStatus,
  FlagReason,
} from '@/lib/domain/enums';

/**
 * Common Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Report Types
 */
export interface ApiReport {
  _id: string;
  caseId: string;
  category: ReportCategory;
  status: ReportStatus;
  institutionId: string;
  institutionName: string;
  institutionSlug?: string;
  narrative: string;
  incidentDate: string; // ISO date string
  incidentLocation: string;
  accusedName?: string;
  accusedDesignation?: string;
  witnessPresentBn?: string;
  verificationLevel: VerificationLevel;
  piiFindings?: string[];
  reviewNotes?: string;
  publishedAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface ReportListParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  area?: string;
  verificationLevel?: string;
  search?: string;
}

export interface ReportListResponse {
  reports: ApiReport[];
  pagination: PaginationMeta;
}

export interface ReportCreateData {
  category: ReportCategory;
  institutionId: string;
  institutionName: string;
  narrative: string;
  incidentDate: string;
  incidentLocation: string;
  accusedName?: string;
  accusedDesignation?: string;
  witnessPresentBn?: string;
}

export interface ReportCreateResponse {
  caseId: string;
  id: string;
  message: string;
}

/**
 * Institution Types
 */
export interface ApiInstitution {
  _id: string;
  slug: string;
  nameBn: string;
  nameEn?: string;
  category: string;
  type: string;
  area: string;
  address?: string;
  description?: string;
  reportCount: number;
  publishedCount?: number;
  verifiedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionListParams {
  page?: number;
  limit?: number;
  category?: string;
  area?: string;
  type?: string;
  search?: string;
}

export interface InstitutionListResponse {
  institutions: ApiInstitution[];
  pagination: PaginationMeta;
}

export interface InstitutionDetailResponse {
  institution: ApiInstitution;
  recentReports: ApiReport[];
}

/**
 * Appeal Types
 */
export interface ApiAppeal {
  _id: string;
  reportId: string | { _id: string; caseId: string };
  caseId: string;
  reason: AppealReason;
  description: string;
  status: AppealStatus;
  resolution?: string;
  resolvedBy?: {
    _id: string;
    name: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppealListParams {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
}

export interface AppealListResponse {
  appeals: ApiAppeal[];
  pagination: PaginationMeta;
}

export interface AppealCreateData {
  caseId: string;
  reason: AppealReason;
  description: string;
}

/**
 * Flag Types
 */
export interface ApiFlag {
  _id: string;
  reportId: string | {
    _id: string;
    caseId: string;
    narrative?: string;
  };
  reason: FlagReason;
  details?: string;
  status: FlagStatus;
  reviewedBy?: {
    _id: string;
    name: string;
    role: UserRole;
  };
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlagListParams {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
}

export interface FlagListResponse {
  flags: ApiFlag[];
  pagination: PaginationMeta;
}

export interface FlagCreateData {
  reportId: string;
  reason: FlagReason;
  details?: string;
}

/**
 * Person Types
 */
export interface ApiPerson {
  _id: string;
  slug: string;
  name: string;
  designation?: string;
  nameVisibility: 'hidden' | 'published' | 'redacted';
  reportCount: number;
  verifiedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonListParams {
  page?: number;
  limit?: number;
  visibility?: string;
  search?: string;
}

export interface PersonListResponse {
  people: ApiPerson[];
  pagination: PaginationMeta;
}

export interface PersonDetailResponse {
  person: ApiPerson;
  reports: ApiReport[];
}

/**
 * User Types
 */
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
}

export interface UserListResponse {
  users: ApiUser[];
  pagination: PaginationMeta;
}

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Evidence Types
 */
export interface ApiEvidence {
  _id: string;
  reportId: string;
  type: 'document' | 'image' | 'audio' | 'video';
  url: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Audit Log Types
 */
export interface ApiAuditLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogListParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  targetType?: string;
}

export interface AuditLogListResponse {
  logs: ApiAuditLog[];
  pagination: PaginationMeta;
}

/**
 * Admin Dashboard Types
 */
export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
}

export interface DashboardStatsResponse {
  metrics: DashboardMetric[];
  piiAlerts: number;
}

/**
 * Authentication Types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: ApiUser;
  token: string;
}

/**
 * Error Types
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

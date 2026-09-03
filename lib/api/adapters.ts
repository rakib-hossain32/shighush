/**
 * API Response Adapters
 * 
 * Converts backend API responses to frontend types
 * Ensures compatibility between backend and frontend data structures
 */

import type { ModerationReport, PublicReport, Institution, Appeal, Flag, StaffUser, AuditLogEntry } from '@/services/_shared/types';
import type { ReportCategory, ReportStatus, VerificationLevel, UserRole } from '@/lib/domain/enums';

/**
 * Convert backend report to frontend PublicReport type
 */
export function adaptPublicReport(apiReport: any): PublicReport {
  return {
    id: apiReport._id || apiReport.id,
    slug: apiReport.caseId,
    publicId: apiReport.caseId,
    title: apiReport.narrative?.substring(0, 60) || 'রিপোর্ট',
    category: apiReport.category as ReportCategory,
    institution: {
      id: apiReport.institutionId,
      nameBn: apiReport.institutionName,
      slug: apiReport.institutionSlug || '',
    },
    location: {
      area: apiReport.incidentLocation || apiReport.area || 'unknown',
    },
    verificationLevel: apiReport.verificationLevel as VerificationLevel || 'pending',
    submittedAt: new Date(apiReport.createdAt),
    publishedAt: apiReport.publishedAt ? new Date(apiReport.publishedAt) : undefined,
    narrative: apiReport.narrative,
    incidentDate: new Date(apiReport.incidentDate),
  };
}

/**
 * Convert backend report to frontend ModerationReport type
 */
export function adaptModerationReport(apiReport: any): ModerationReport {
  return {
    id: apiReport._id || apiReport.id,
    publicId: apiReport.caseId,
    title: apiReport.narrative?.substring(0, 60) || 'রিপোর্ট',
    category: apiReport.category as ReportCategory,
    status: apiReport.status as ReportStatus,
    institution: {
      id: apiReport.institutionId,
      nameBn: apiReport.institutionName,
      slug: '',
    },
    location: {
      area: apiReport.incidentLocation || apiReport.area || 'unknown',
    },
    verificationLevel: apiReport.verificationLevel as VerificationLevel || 'pending',
    piiFindings: apiReport.piiFindings || [],
    submittedAt: new Date(apiReport.createdAt),
    reviewedAt: apiReport.updatedAt ? new Date(apiReport.updatedAt) : undefined,
    assignedTo: apiReport.assignedTo ? {
      id: apiReport.assignedTo._id || apiReport.assignedTo.id,
      name: apiReport.assignedTo.name,
    } : undefined,
  };
}

/**
 * Convert backend institution to frontend Institution type
 */
export function adaptInstitution(apiInstitution: any): Institution {
  return {
    id: apiInstitution._id || apiInstitution.id,
    slug: apiInstitution.slug,
    nameBn: apiInstitution.nameBn,
    nameEn: apiInstitution.nameEn,
    category: apiInstitution.category,
    type: apiInstitution.type,
    area: apiInstitution.area,
    address: apiInstitution.address,
    description: apiInstitution.description,
    reportCount: apiInstitution.reportCount || 0,
    publishedCount: apiInstitution.publishedCount || 0,
    verifiedCount: apiInstitution.verifiedCount || 0,
  };
}

/**
 * Convert backend appeal to frontend Appeal type
 */
export function adaptAppeal(apiAppeal: any): Appeal {
  return {
    id: apiAppeal._id || apiAppeal.id,
    reportId: apiAppeal.reportId,
    caseId: apiAppeal.caseId,
    reason: apiAppeal.reason,
    description: apiAppeal.description,
    status: apiAppeal.status,
    submittedAt: new Date(apiAppeal.createdAt),
    resolvedAt: apiAppeal.resolvedAt ? new Date(apiAppeal.resolvedAt) : undefined,
    resolution: apiAppeal.resolution,
    resolvedBy: apiAppeal.resolvedBy ? {
      id: apiAppeal.resolvedBy._id || apiAppeal.resolvedBy.id,
      name: apiAppeal.resolvedBy.name,
    } : undefined,
  };
}

/**
 * Convert backend flag to frontend Flag type
 */
export function adaptFlag(apiFlag: any): Flag {
  return {
    id: apiFlag._id || apiFlag.id,
    reportId: apiFlag.reportId._id || apiFlag.reportId,
    report: apiFlag.reportId.caseId ? {
      id: apiFlag.reportId._id,
      caseId: apiFlag.reportId.caseId,
      narrative: apiFlag.reportId.narrative?.substring(0, 100),
    } : undefined,
    reason: apiFlag.reason,
    details: apiFlag.details,
    status: apiFlag.status,
    submittedAt: new Date(apiFlag.createdAt),
    reviewedBy: apiFlag.reviewedBy ? {
      id: apiFlag.reviewedBy._id || apiFlag.reviewedBy.id,
      name: apiFlag.reviewedBy.name,
    } : undefined,
    reviewNotes: apiFlag.reviewNotes,
  };
}

/**
 * Convert backend user to frontend StaffUser type
 */
export function adaptStaffUser(apiUser: any): StaffUser {
  return {
    id: apiUser._id || apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role as UserRole,
    createdAt: new Date(apiUser.createdAt),
    lastActive: apiUser.updatedAt ? new Date(apiUser.updatedAt) : new Date(apiUser.createdAt),
  };
}

/**
 * Convert backend audit log to frontend AuditLogEntry type
 */
export function adaptAuditLog(apiLog: any): AuditLogEntry {
  return {
    id: apiLog._id || apiLog.id,
    timestamp: new Date(apiLog.createdAt),
    userId: apiLog.userId._id || apiLog.userId.id,
    userName: apiLog.userId.name,
    userRole: apiLog.userId.role as UserRole,
    action: apiLog.action,
    targetType: apiLog.targetType,
    targetId: apiLog.targetId,
    details: apiLog.details,
    ipAddress: apiLog.ipAddress,
  };
}

/**
 * Pagination helper
 */
export function adaptPagination(apiPagination: any) {
  return {
    total: apiPagination.total || 0,
    page: apiPagination.page || 1,
    pages: apiPagination.pages || 1,
    limit: apiPagination.limit || 20,
  };
}

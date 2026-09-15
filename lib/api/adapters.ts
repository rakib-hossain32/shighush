/**
 * API Response Adapters
 * 
 * Converts backend API responses to frontend types
 * Ensures compatibility between backend and frontend data structures
 */

import type { 
  ModerationReport, 
  PublicReport, 
  Institution, 
  Appeal, 
  Flag, 
  StaffUser, 
  AuditLogEntry 
} from '@/services/_shared/types';
import type { 
  ReportCategory, 
  ReportStatus, 
  VerificationLevel, 
  UserRole,
  InstitutionType,
  InstitutionCategory,
  OfficeLevel,
  AppealReason,
  AppealStatus,
  FlagReason
} from '@/lib/domain/enums';
import { officeNameBn } from '@/lib/domain/office-name';

function toIsoString(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toISOString();
  }
  return new Date().toISOString();
}

/**
 * Convert backend report to frontend PublicReport type
 */
export function adaptPublicReport(apiReport: any): PublicReport {
  const caseIdNum = typeof apiReport.caseId === 'number' 
    ? apiReport.caseId 
    : parseInt(String(apiReport.caseId || '').replace(/\D/g, ''), 10) || 0;

  return {
    id: apiReport._id || apiReport.id || '',
    publicId: caseIdNum,
    slug: apiReport.slug || apiReport.caseId || '',
    title: apiReport.title || apiReport.narrative?.substring(0, 60) || 'রিপোর্ট',
    summary: apiReport.summary || apiReport.narrative?.substring(0, 150) || '',
    narrative: apiReport.narrative,
    category: (apiReport.category as ReportCategory) || 'other',
    status: (apiReport.status as ReportStatus) || 'published',
    verificationLevel: (apiReport.verificationLevel as VerificationLevel) || 'unverified',
    institution: {
      id: apiReport.institutionId || apiReport.institution?._id || apiReport.institution?.id || '',
      nameBn: apiReport.institutionName || apiReport.institution?.nameBn || '',
      slug: apiReport.institutionSlug || apiReport.institution?.slug || '',
    },
    location: {
      area: apiReport.incidentLocation || apiReport.area || apiReport.location?.area || 'unknown',
      officeName: officeNameBn(apiReport.officeName || apiReport.location?.officeName),
    },
    incidentDate: typeof apiReport.incidentDate === 'string' 
      ? { exact: apiReport.incidentDate } 
      : (apiReport.incidentDate || undefined),
    evidence: apiReport.evidence || [],
    publishedAt: toIsoString(apiReport.publishedAt || apiReport.createdAt),
    updatedAt: toIsoString(apiReport.updatedAt || apiReport.createdAt),
  };
}

/**
 * Convert backend report to frontend ModerationReport type
 */
export function adaptModerationReport(apiReport: any): ModerationReport {
  const base = adaptPublicReport(apiReport);
  return {
    ...base,
    rawNarrative: apiReport.rawNarrative || apiReport.narrative || '',
    piiFindings: apiReport.piiFindings || [],
    moderatorNotes: apiReport.moderatorNotes || [],
    submittedAt: toIsoString(apiReport.createdAt),
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
    id: apiInstitution._id || apiInstitution.id || '',
    slug: apiInstitution.slug || '',
    nameBn: apiInstitution.nameBn || '',
    nameEn: apiInstitution.nameEn,
    category: (apiInstitution.category as InstitutionCategory) || 'other',
    type: (apiInstitution.type as InstitutionType) || 'government',
    officeLevel: (apiInstitution.officeLevel as OfficeLevel) || 'upazila',
    location: {
      area: apiInstitution.area || apiInstitution.location?.area,
      addressPublic: apiInstitution.address || apiInstitution.location?.addressPublic,
    },
    website: apiInstitution.website,
    status: apiInstitution.status || 'active',
    metrics: apiInstitution.metrics,
    serviceArea: apiInstitution.serviceArea || apiInstitution.area || apiInstitution.location?.area || 'upazila_wide',
  };
}

/**
 * Convert backend appeal to frontend Appeal type
 */
export function adaptAppeal(apiAppeal: any): Appeal {
  return {
    id: apiAppeal._id || apiAppeal.id || '',
    reportId: typeof apiAppeal.reportId === 'string' ? apiAppeal.reportId : apiAppeal.reportId?._id,
    caseId: apiAppeal.caseId || '',
    reportSlug: apiAppeal.reportSlug,
    reportTitle: apiAppeal.reportTitle,
    reportCategory: apiAppeal.reportCategory,
    institutionName: apiAppeal.institutionName,
    reason: (apiAppeal.reason as AppealReason) || 'other',
    detail: apiAppeal.description || apiAppeal.detail || '',
    status: (apiAppeal.status === 'resolved' ? 'upheld' : apiAppeal.status as AppealStatus) || 'received',
    receivedAt: toIsoString(apiAppeal.createdAt || apiAppeal.receivedAt),
    resolvedAt: apiAppeal.resolvedAt ? toIsoString(apiAppeal.resolvedAt) : undefined,
    contactEmail: apiAppeal.contactEmail,
    resolution: apiAppeal.resolution,
  };
}

/**
 * Convert backend flag to frontend Flag type
 */
export function adaptFlag(apiFlag: any): Flag {
  return {
    id: apiFlag._id || apiFlag.id || '',
    reportSlug: apiFlag.reportSlug || apiFlag.reportId?.slug || apiFlag.reportId?.caseId || '',
    reportTitle: apiFlag.reportTitle || apiFlag.reportId?.title || apiFlag.reportId?.narrative?.substring(0, 60) || '',
    reason: (apiFlag.reason as FlagReason) || 'misinformation',
    detail: apiFlag.details || apiFlag.detail,
    status: (apiFlag.status as 'open' | 'actioned' | 'dismissed') || 'open',
    raisedAt: toIsoString(apiFlag.createdAt || apiFlag.raisedAt),
  };
}

/**
 * Convert backend user to frontend StaffUser type
 */
export function adaptStaffUser(apiUser: any): StaffUser {
  return {
    id: apiUser._id || apiUser.id || '',
    name: apiUser.name || '',
    email: apiUser.email || '',
    role: (apiUser.role as UserRole) || 'Moderator',
    createdAt: toIsoString(apiUser.createdAt),
    lastLoginAt: apiUser.lastLoginAt ? toIsoString(apiUser.lastLoginAt) : undefined,
  };
}

/**
 * Convert backend audit log to frontend AuditLogEntry type
 */
export function adaptAuditLog(apiLog: any): AuditLogEntry {
  return {
    id: apiLog._id || apiLog.id || '',
    actor: {
      id: apiLog.userId?._id || apiLog.userId?.id || apiLog.actor?.id || '',
      name: apiLog.userId?.name || apiLog.actor?.name || 'System',
      role: (apiLog.userId?.role || apiLog.actor?.role || 'Moderator') as UserRole,
    },
    action: apiLog.action || '',
    target: {
      type: apiLog.targetType || apiLog.target?.type || 'report',
      id: apiLog.targetId || apiLog.target?.id || '',
    },
    summary: apiLog.details || apiLog.summary || '',
    at: toIsoString(apiLog.createdAt || apiLog.timestamp || apiLog.at),
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

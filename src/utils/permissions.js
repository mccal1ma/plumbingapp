// Role-based permission utilities using permission arrays

const PERMISSIONS = {
  admin: [
    "create:jobs",
    "edit:jobs",
    "delete:jobs",
    "view:all-jobs",
    "manage:employees",
    "view:analytics",
    "view:calendar",
    "view:messages",
    "message:receptionist",
  ],
  receptionist: [
    "create:jobs",
    "edit:jobs",
    "delete:jobs",
    "view:all-jobs",
    "view:calendar",
    "view:messages",
    "message:admin",
    "message:contractor",
  ],
  contractor: [
    "accept:jobs",
    "reject:jobs",
    "message:receptionist",
  ],
};

// Generic permission checker
export const hasPermission = (role, permission) => {
  if (!PERMISSIONS[role]) return false;
  return PERMISSIONS[role].includes(permission);
};

// Role checking helpers
export const isAdmin = (role) => {
  return role === "admin";
};

export const isReceptionist = (role) => {
  return role === "receptionist";
};

export const isContractor = (role) => {
  return role === "contractor";
};

// Permission checking functions (backward compatible)
export const canCreateJob = (role) => {
  return hasPermission(role, "create:jobs");
};

export const canEditJob = (role, jobCreatorId, userId) => {
  return hasPermission(role, "edit:jobs");
};

export const canDeleteJob = (role, jobCreatorId, userId) => {
  return hasPermission(role, "delete:jobs");
};

export const canViewAllJobs = (role) => {
  return hasPermission(role, "view:all-jobs");
};

export const canManageEmployees = (role) => {
  return hasPermission(role, "manage:employees");
};

export const canViewAnalytics = (role) => {
  return hasPermission(role, "view:analytics");
};

export const canViewCalendar = (role) => {
  return hasPermission(role, "view:calendar");
};

export const canAcceptRejectJobs = (role) => {
  return hasPermission(role, "accept:jobs") || hasPermission(role, "reject:jobs");
};

export const canSendMessages = (role) => {
  return hasPermission(role, "message:receptionist") || hasPermission(role, "message:employees");
};

export const canViewMessages = (role) => {
  return hasPermission(role, "view:messages");
};

export const canMessageEmployees = (role) => {
  return hasPermission(role, "message:employees");
};

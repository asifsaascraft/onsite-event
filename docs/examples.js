// ==========================================
// Authentication Examples
// ==========================================

export const registerAdminExample = {
  fullName: "Admin",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "Admin@123",
};

export const loginExample = {
  email: "admin@example.com",
  password: "Admin@123",
};

export const forgotPasswordExample = {
  email: "admin@example.com",
};

export const resetPasswordExample = {
  password: "NewPassword@123",
};

// ==========================================
// Generic Examples
// ==========================================

export const successExample = {
  success: true,
  message: "Request completed successfully.",
  data: null,
};

export const errorExample = {
  success: false,
  message: "Something went wrong.",
  errors: null,
  data: null,
};
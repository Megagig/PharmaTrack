// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Password strength check
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password || password.length < 8) return 'weak';
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const strength = [hasLowercase, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  if (strength <= 2) return 'weak';
  if (strength === 3) return 'medium';
  return 'strong';
};

// Phone number validation (Nigerian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  // Nigerian phone number format: +234 or 0 followed by 9 or 10 digits
  const phoneRegex = /^(\+234|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

// Required field validation
export const isNotEmpty = (value: string): boolean => {
  return value.trim() !== '';
};

// License number validation (PCN format)
export const isValidLicenseNumber = (license: string): boolean => {
  // Simple validation for PCN license number
  // Assuming PCN license numbers are alphanumeric and at least 5 characters
  return /^[A-Za-z0-9]{5,}$/.test(license);
};

// Form field validation with error message
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export const validateField = (
  fieldName: string,
  value: string,
  validationFn: (value: string) => boolean,
  errorMessage: string
): ValidationResult => {
  return {
    isValid: validationFn(value),
    errorMessage: validationFn(value) ? '' : errorMessage,
  };
};

// Common validation functions
export const validateEmail = (email: string): ValidationResult => {
  return validateField(
    'email',
    email,
    isValidEmail,
    'Please enter a valid email address'
  );
};

export const validatePassword = (password: string): ValidationResult => {
  return validateField(
    'password',
    password,
    isValidPassword,
    'Password must be at least 8 characters long'
  );
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  return validateField(
    'phone',
    phone,
    isValidPhoneNumber,
    'Please enter a valid Nigerian phone number'
  );
};

export const validateRequired = (fieldName: string, value: string): ValidationResult => {
  return validateField(
    fieldName,
    value,
    isNotEmpty,
    `${fieldName} is required`
  );
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  return {
    isValid: password === confirmPassword,
    errorMessage: password === confirmPassword ? '' : 'Passwords do not match',
  };
};

export const validateLicenseNumber = (license: string): ValidationResult => {
  return validateField(
    'license',
    license,
    isValidLicenseNumber,
    'Please enter a valid PCN license number'
  );
};

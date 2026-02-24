/**
 * Utility functions for the application
 */

/**
 * Creates a page URL for navigation
 * @param pageName - The name of the page to navigate to
 * @param params - Optional query parameters
 * @returns The URL path for the page
 */
export function createPageUrl(pageName: string, params?: Record<string, string>): string {
  const baseUrl = window.location.origin;
  
  // Map of page names to their routes
  const pageRoutes: Record<string, string> = {
    Landing: '/',
    Login: '/login',
    Register: '/register',
    StudentDashboard: '/student-dashboard',
    ProfessorDashboard: '/professor-dashboard',
    EstudianteDetalle: '/estudiante-detalle',
    ModulePage: '/module',
  };

  const route = pageRoutes[pageName] || `/${pageName.toLowerCase()}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    return `${baseUrl}${route}?${queryString}`;
  }
  
  return `${baseUrl}${route}`;
}

/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @param locale - The locale to use (default: 'es-ES')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'es-ES'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncates a string to a maximum length
 * @param str - The string to truncate
 * @param maxLength - The maximum length
 * @param suffix - The suffix to add if truncated (default: '...')
 * @returns The truncated string
 */
export function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Delays execution for a specified time
 * @param ms - Milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML special characters
 * @param input The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(input: string | null | undefined): string {
  if (input == null) return '';
  
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * Sanitizes an object by escaping HTML special characters in all string properties
 * @param obj The object to sanitize
 * @returns A new object with sanitized string properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (typeof value === 'string') {
      (result as Record<string, any>)[key] = sanitizeString(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (result as Record<string, any>)[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      (result as Record<string, any>)[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) : 
        (item && typeof item === 'object') ? sanitizeObject(item) : item
      );
    }
  });
  
  return result;
}

/**
 * Creates a safe HTML string that can be used with innerHTML
 * This should only be used when absolutely necessary
 * @param html The HTML string to sanitize
 * @returns A sanitized HTML string
 */
/**
 * Creates HTML that is safe to insert into the DOM by removing potentially dangerous elements and attributes
 */
import DOMPurify from 'dompurify';

export function createSafeHTML(html: string): string {
  if (!html) return '';
  
  // Use DOMPurify to sanitize the HTML
  return DOMPurify.sanitize(html);
}

/**
 * Sanitizes CSV data to prevent XSS attacks
 * @param rows The CSV data rows to sanitize
 * @returns Sanitized CSV data rows
 */
export function sanitizeCSVData(rows: string[][]): string[][] {
  return rows.map(row => 
    row.map(cell => sanitizeString(cell))
  );
}

/**
 * Sanitizes URL parameters to prevent XSS attacks
 * @param params The URL parameters to sanitize
 * @returns Sanitized URL parameters
 */
export function sanitizeURLParams(params: Record<string, string>): Record<string, string> {
  const sanitizedParams: Record<string, string> = {};
  
  Object.keys(params).forEach(key => {
    sanitizedParams[sanitizeString(key)] = sanitizeString(params[key]);
  });
  
  return sanitizedParams;
}

/**
 * Sanitizes a value for use in HTML attributes
 * @param value The value to sanitize
 * @returns Sanitized attribute value
 */
export function sanitizeAttribute(value: string | null | undefined): string {
  if (value == null) return '';
  
  return String(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#61;');
}

/**
 * Decodes HTML entities back to their original characters
 * @param input The string with HTML entities to decode
 * @returns The decoded string
 */
export function decodeHTMLEntities(input: string | null | undefined): string {
  if (input == null) return '';
  
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.body.textContent || '';
}
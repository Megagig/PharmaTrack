/**
 * Format a number as a currency string with Naira symbol (₦)
 * @param amount - The amount to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted currency string (e.g., "₦1,234.56")
 */
export const formatCurrency = (amount: number | string, decimals: number = 2): string => {
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if the amount is a valid number
  if (isNaN(numAmount)) return '₦0.00';
  
  // Format the number with commas and specified decimal places
  const formattedAmount = numAmount.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `₦${formattedAmount}`;
};

/**
 * Format a number as a currency string with Naira symbol (₦) and no decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string without decimals (e.g., "₦1,234")
 */
export const formatCurrencyNoDecimals = (amount: number | string): string => {
  return formatCurrency(amount, 0);
};

/**
 * Extract the numeric value from a currency string
 * @param currencyString - The currency string (e.g., "₦1,234.56")
 * @returns The numeric value (e.g., 1234.56)
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  // Remove all non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(numericString) || 0;
};

/**
 * Format currency amount to display string.
 */
export const formatCurrency = (amount: number, currency = '₹'): string => {
  return `${currency}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
};

/**
 * Format date string to display format.
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time string (HH:mm) to 12-hour display.
 */
export const formatTime = (time: string): string => {
  const [hourStr, min] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${min} ${ampm}`;
};

/**
 * Format rating to display string.
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Generate available time slots between start and end hours.
 */
export const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

/**
 * Generates unique meeting IDs in format XXX-XXX-XXX
 * Uses alphanumeric uppercase characters
 */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars: I, O, 0, 1

export function generateMeetingId(): string {
  const generateSegment = (): string => {
    let segment = '';
    for (let i = 0; i < 3; i++) {
      segment += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return segment;
  };

  return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

/**
 * Validates meeting ID format
 */
export function isValidMeetingId(meetingId: string): boolean {
  const pattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  return pattern.test(meetingId);
}

/**
 * Normalizes meeting ID (uppercase, trim)
 */
export function normalizeMeetingId(meetingId: string): string {
  return meetingId.trim().toUpperCase();
}

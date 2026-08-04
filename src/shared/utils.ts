export function convertToBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return true;
    }

    const val = value.toLowerCase().trim();
    return val === 'true' || val === '1';
  }

  return false;
}

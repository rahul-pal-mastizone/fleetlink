// Simple duration estimate based on pincodes (same as the TS version in your repo)
// Formula: |to - from| % 24 hours
export function calculateRideDuration(fromPincode, toPincode) {
  const fromNum = parseInt(fromPincode);
  const toNum = parseInt(toPincode);
  if (Number.isNaN(fromNum) || Number.isNaN(toNum)) {
    throw new Error('Invalid pincode: pincodes must be numeric');
  }
  const diff = Math.abs(toNum - fromNum);
  const hours = diff % 24;
  return hours;
}

export function calculateEndTime(startTimeISO, fromPincode, toPincode) {
  const start = new Date(startTimeISO);
  const hours = calculateRideDuration(fromPincode, toPincode);
  const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
  return end;
}

export function checkTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

export function getTimeWithAMPMFromDate(dateString: string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  let ampm = "AM";
  let hoursIn12HrFormat = hours;

  if (hours >= 12) {
    ampm = "PM";
    hoursIn12HrFormat = hours % 12;
  }

  if (hoursIn12HrFormat === 0) {
    hoursIn12HrFormat = 12; // 12:00 AM or 12:00 PM
  }

  return `${hoursIn12HrFormat}:${minutes} ${ampm}`;
}

// Keep the original extractTime function
export function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
}

// Add a new function for formatting date and time
export function formatDateAndTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // getMonth() returns 0-11
    const day = padZero(date.getDate());
    const time = extractTime(dateString);
    
    return `${year}-${month}-${day} ${time}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
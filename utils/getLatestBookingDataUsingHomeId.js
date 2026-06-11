const Booking = require("../models/bookingModel");

const getHomeBookings = async (homeId) => {
  const bookings = await Booking.find({ homeId }, { bookingDate: 1, _id: 0 });
  if (bookings.length === 0) {
    return null;
  }

  const dDate = dateConvert(bookings);
  return dDate ?? [];
};
const dateConvert = (bookings) => {
  const disableRange = bookings.map((b) => {
    // 1. Create a clean date object from the backend check-out date
    const checkOutDate = new Date(b.bookingDate.checkOut);
    const checkInDate = new Date(b.bookingDate.checkIn);

    // 2. Shift the checkout date back by 1 day for the frontend UI only
    checkOutDate.setDate(checkOutDate.getDate() - 1);
    checkInDate.setDate(checkInDate.getDate() + 1);

    return {
      // Keep check-in exactly the same
      from: checkInDate.toISOString().split("T")[0],
      // Use the shifted check-out date string
      to: checkOutDate.toISOString().split("T")[0],
    };
  });

  return disableRange;
};
const getPureTimestamp = (dateInput) => {
  // If it's an ISO string (contains 'T'), split it to get just the YYYY-MM-DD part
  const dateString =
    typeof dateInput === "string" ? dateInput.split("T")[0] : dateInput;

  const d = new Date(dateString);
  // Reset hours, minutes, seconds, and milliseconds to 0
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
module.exports = { getHomeBookings, dateConvert, getPureTimestamp };

async function loadBookings() {
  const container = document.getElementById("bookings");

  try {
    const res = await fetch("http://localhost:3000/bookings");
    const bookings = await res.json();

    if (bookings.length === 0) {
      container.innerHTML = "<p>No bookings yet</p>";
      return;
    }

    container.innerHTML = "";

    bookings.forEach(b => {
      const guestsHTML = b.guests
        ? b.guests.map(g => `<li>${g.name} (${g.age})</li>`).join("")
        : "<li>No guest data</li>";

      // 🔧 DISPLAY FIXES ONLY
      const roomDisplay =
        typeof b.roomId === "object"
          ? b.roomId._id || b.roomId.roomNumber
          : b.roomId;

      const formattedTotal ="\u20B9" + Number(b.totalAmount).toLocaleString("en-IN");


      const div = document.createElement("div");
      div.className = "room-card";

      div.innerHTML = `
        <h3>Room ID: ${roomDisplay}</h3>
        <p><b>Customer:</b> ${b.customerName}</p>
        <p><b>Dates:</b>
          ${new Date(b.checkIn).toDateString()} ->
          ${new Date(b.checkOut).toDateString()}
        </p>
        <p><b>Total:</b> ${formattedTotal}</p>
        <p><b>Status:</b> ${b.status}</p>
        <b>Guests:</b>
        <ul>${guestsHTML}</ul>  
        <button class="danger-btn" onclick="deleteBooking('${b._id}')">
  Delete Booking
</button>
    `;

      container.appendChild(div);
    });

  } catch (err) {
    container.innerHTML = "<p>Failed to load bookings</p>";
  }
}

loadBookings();
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  try {
    await fetch(`http://localhost:3000/bookings/${id}?admin=true`, {
  method: "DELETE"
});


    loadBookings(); // refresh dashboard
  } catch (err) {
    alert("Failed to delete booking");
  }
}


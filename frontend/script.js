const API = "http://localhost:3000";

/* Check availability */
function checkAvailability() {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  fetch(`${API}/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(room => {
        html += `<p>Room ${room.roomNumber} 
        <button onclick="selectRoom('${room._id}')">Book</button></p>`;
      });
      document.getElementById("rooms").innerHTML = html;
    });
}

function selectRoom(id) {
  localStorage.setItem("roomId", id);
  window.location.href = "booking.html";
}

function bookRoom() {
  const booking = {
    roomId: localStorage.getItem("roomId"),
    customerName: document.getElementById("name").value,
    checkIn: new Date(),
    checkOut: new Date()
  };

  fetch(`${API}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  }).then(() => alert("Booked!"));
}

/* Admin view */
if (window.location.pathname.includes("admin")) {
  fetch(`${API}/bookings`)
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(b => {
        html += `<p>${b.customerName} - Room ${b.roomId.roomNumber}</p>`;
      });
      document.getElementById("bookings").innerHTML = html;
    });
}

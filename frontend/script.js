const API = "http://localhost:3000";

/* Check room availability */
function checkAvailability() {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (!checkIn || !checkOut) {
    alert("Please select both dates");
    return;
  }

  fetch(`${API}/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)
    .then(res => res.json())
    .then(rooms => {
      const container = document.getElementById("rooms");
      container.innerHTML = "";

      if (rooms.length === 0) {
        container.innerHTML = "<p>No rooms available</p>";
        return;
      }

      rooms.forEach(room => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p>
            Room ${room.roomNumber} (${room.type}) - ₹${room.price}
            <button onclick="selectRoom('${room._id}', '${checkIn}', '${checkOut}')">
              Book
            </button>
          </p>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching rooms");
    });
}

/* Store selected room and dates */
function selectRoom(roomId, checkIn, checkOut) {
  localStorage.setItem("roomId", roomId);
  localStorage.setItem("checkIn", checkIn);
  localStorage.setItem("checkOut", checkOut);
  window.location.href = "booking.html";
}

/* Book room */
function bookRoom() {
  const booking = {
    roomId: localStorage.getItem("roomId"),
    customerName: document.getElementById("name").value,
    checkIn: localStorage.getItem("checkIn"),
    checkOut: localStorage.getItem("checkOut")
  };

  fetch(`${API}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  })
    .then(res => res.json())
    .then(() => {
      alert("Booked!");
      localStorage.clear();
    });
}

/* Admin view */
if (window.location.pathname.includes("admin")) {
  fetch(`${API}/bookings`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("bookings");
      container.innerHTML = "";

      data.forEach(b => {
        const p = document.createElement("p");
        p.innerText = `${b.customerName} - Room ${b.roomId.roomNumber}`;
        container.appendChild(p);
      });
    });
}

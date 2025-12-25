async function checkAvailability() {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (!checkIn || !checkOut) {
    alert("Please select dates");
    return;
  }

  const res = await fetch(
    `http://localhost:3000/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`
  );

  const rooms = await res.json();
  const container = document.getElementById("rooms");
  container.innerHTML = "";

  if (rooms.length === 0) {
    container.innerHTML = "<p>No rooms available</p>";
    return;
  }

  rooms.forEach(room => {
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>Room ${room.roomNumber} (${room.type})</h3>
      <p>Price: ₹${room.price}</p>
      <p>Capacity: ${room.capacity} people</p>
      <button onclick="bookRoom('${room._id}')">Book Now</button>
    `;

    container.appendChild(div);
  });
}

async function bookRoom(roomId) {
  const name = prompt("Enter your name:");
  if (!name) return;

  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  await fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
      customerName: name,
      checkIn,
      checkOut
    })
  });

  alert("Room booked successfully!");
  checkAvailability();
}

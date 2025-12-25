async function checkAvailability() {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const beds = document.getElementById("beds").value;

  if (!checkIn || !checkOut) {
    alert("Please select dates");
    return;
  }

  const res = await fetch(
    `http://localhost:3000/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`
  );

  let rooms = await res.json();

  // Filter by beds if entered
  if (beds) {
    rooms = rooms.filter(r => r.capacity >= beds);
  }

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
      <h3>Room ${room.roomNumber}</h3>
      <p>Type: ${room.type}</p>
      <p>Beds: ${room.capacity}</p>
      <p>Price: ₹${room.price}</p>
      <button onclick="bookRoom('${room._id}')">Book Now</button>
    `;

    container.appendChild(div);
  });
}

async function bookRoom(roomId) {
  const name = prompt("Enter your name:");
  const age = prompt("Enter your age:");

  if (!name || !age) {
    alert("Details required");
    return;
  }

  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  const res = await fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
      customerName: name,
      checkIn,
      checkOut
    })
  });

  const data = await res.json();
  alert(data.message || "Booked!");
}

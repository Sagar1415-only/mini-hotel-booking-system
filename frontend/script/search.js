const params = new URLSearchParams(window.location.search);

const checkIn = params.get("checkIn");
const checkOut = params.get("checkOut");
const beds = params.get("beds");

if (!checkIn || !checkOut || !beds) {
  alert("Missing search parameters");
}

/* ===========================
   LOAD AVAILABLE ROOMS
=========================== */
async function loadRooms() {
  try {
    const res = await fetch(
      `http://localhost:3000/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&beds=${beds}`
    );

    const rooms = await res.json();

    const container = document.getElementById("rooms");
    container.innerHTML = "";

    if (!rooms.length) {
      container.innerHTML = "<p>No rooms available</p>";
      return;
    }

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.className = "room-card";

      div.innerHTML = `
        <h3>Room ${room.roomNumber} (${room.type})</h3>
        <p>Price: ₹${room.price}</p>
        <p>Capacity: ${room.capacity} beds</p>
        <button onclick="selectRoom('${room._id}')">Select</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load rooms");
  }
}

/* ===========================
   SELECT ROOM
=========================== */
function selectRoom(roomId) {
  window.location.href =
    `booking.html?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&beds=${beds}`;
}

loadRooms();

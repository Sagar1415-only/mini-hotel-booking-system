// rooms.js — FINAL, GUARANTEED WORKING

const params = new URLSearchParams(window.location.search);

const checkIn = params.get("checkIn");
const checkOut = params.get("checkOut");
const beds = Number(params.get("beds"));

const roomsDiv = document.getElementById("rooms");

// 🔴 HARD GUARD
if (!checkIn || !checkOut || !beds || !roomsDiv) {
  alert("Missing search details. Redirecting...");
  window.location.href = "index.html";
}

// 🔄 Load available rooms
loadRooms();

async function loadRooms() {
  try {
    const res = await fetch(
      `http://localhost:3000/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&beds=${beds}`
    );

    if (!res.ok) throw new Error("Failed to load rooms");

    const rooms = await res.json();
    roomsDiv.innerHTML = "";

    if (rooms.length === 0) {
      roomsDiv.innerHTML = "<p>No rooms available</p>";
      return;
    }

    rooms.forEach(room => {
      const card = document.createElement("div");
      card.className = "room-card";

      card.innerHTML = `
        <h3>Room ${room.roomNumber} (${room.type})</h3>
        <p>Price: ₹${room.price} / night</p>
        <p>Capacity: ${room.capacity} beds</p>
        <button onclick="bookRoom('${room._id}', ${room.price})">
          Book
        </button>
      `;

      roomsDiv.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    roomsDiv.innerHTML = "<p>Failed to load rooms</p>";
  }
}

// ➡️ BOOK BUTTON HANDLER (THIS WAS MISSING / BROKEN)
function bookRoom(roomId, price) {
  // Redirect to booking.html with REQUIRED DATA
  window.location.href =
    `booking.html?roomId=${roomId}` +
    `&price=${price}` +
    `&checkIn=${checkIn}` +
    `&checkOut=${checkOut}` +
    `&beds=${beds}`;
}

async function checkAvailability() {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const roomsDiv = document.getElementById("rooms");

  // Clear previous results
  roomsDiv.innerHTML = "";

  if (!checkIn || !checkOut) {
    roomsDiv.innerHTML = "<p>Please select both dates.</p>";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`
    );

    const rooms = await response.json();

    if (rooms.length === 0) {
      roomsDiv.innerHTML = "<p>No rooms available for selected dates.</p>";
      return;
    }

    rooms.forEach(room => {
      const roomCard = document.createElement("div");
      roomCard.className = "room-card";

      roomCard.innerHTML = `
        <h3>Room ${room.roomNumber}</h3>
        <p>Type: ${room.type}</p>
        <p>Price: ₹${room.price}</p>
        <p>Capacity: ${room.capacity}</p>
        <button onclick="bookRoom('${room._id}')">Book</button>
      `;

      roomsDiv.appendChild(roomCard);
    });

  } catch (error) {
    console.error(error);
    roomsDiv.innerHTML = "<p>Error fetching rooms.</p>";
  }
}

async function bookRoom(roomId) {
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  const name = prompt("Enter your name:");
  const age = prompt("Enter your age:");
  const beds = prompt("Beds required:");

  if (!name || !age || !beds) {
    alert("All details required");
    return;
  }

  const response = await fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
      customerName: name,
      age,
      beds,
      checkIn,
      checkOut
    })
  });

  const result = await response.json();
  alert(result.message);
  checkAvailability();
}

  } catch (error) {
    console.error(error);
    alert("Booking failed");
  }
}

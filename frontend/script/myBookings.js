
const name = localStorage.getItem("customerName");
if (!name) {
  window.location.href = "login.html";
}
async function loadMyBookings() {
  const name = localStorage.getItem("customerName");
  if (!name) {
    document.getElementById("myBookings").innerHTML =
      "<p>No user found</p>";
    return;
  }

  const res = await fetch(
    `http://localhost:3000/bookings/user/${name}`
  );
  const bookings = await res.json();

  const container = document.getElementById("myBookings");
  container.innerHTML = "";

  bookings.forEach(b => {
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>Room ID: ${b.roomId}</h3>
   <p>Total: \u20B9${Number(b.totalAmount).toLocaleString("en-IN")}</p>

      <p>Status: ${b.status}</p>
      <button onclick="cancelBooking('${b._id}')">
        Cancel Booking
      </button>
    `;

    container.appendChild(div);
  });
}

async function cancelBooking(id) {
  try {
    const res = await fetch(
      `http://localhost:3000/bookings/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
    }

    loadMyBookings();
  } catch {
    alert("Failed to cancel booking");
  }
}

loadMyBookings();
async function loadWallet() {
  const name = localStorage.getItem("customerName");
  if (!name) return;

  const res = await fetch(`http://localhost:3000/wallet/${name}`);
  const wallet = await res.json();

  document.getElementById("wallet").innerText =
    "Wallet Balance: \u20B9" +
    Number(wallet.balance).toLocaleString("en-IN");
}
loadWallet();


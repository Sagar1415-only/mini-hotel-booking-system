// const p=new URLSearchParams(location.search);
// const data=JSON.parse(sessionStorage.booking);

// fetch("http://localhost:3000/bookings",{
//  method:"POST",
//  headers:{'Content-Type':'application/json'},
//  body:JSON.stringify({
//    roomId:p.get("roomId"),
//    customerName:data.name,
//    bedsRequired:data.guests.length,
//    guests:data.guests,
//    checkIn:p.get("checkIn"),
//    checkOut:p.get("checkOut"),
//    totalAmount:3000,
//    walletOwner:data.name
//  })
// }).then(()=>alert("Booked"));
// payment.js — FINAL STABLE VERSION ✅

document.addEventListener("DOMContentLoaded", async () => {
  const booking = JSON.parse(sessionStorage.getItem("booking"));

  if (!booking) {
    alert("Booking data missing");
    window.location.href = "index.html";
    return;
  }

  // Show amount
  document.getElementById("amountText").innerText =
    `Total Amount: ₹${booking.totalAmount}`;

  // 🔥 FETCH WALLET BALANCE
  const res = await fetch(`http://localhost:3000/wallet/${booking.walletOwner}`);
  const wallet = await res.json();

  document.getElementById("walletText").innerText =
    `Wallet Balance: \u20B9${Number(wallet.balance).toLocaleString("en-IN")}
`;
});


// 💰 Pay with Virtual Coins
async function pay() {
  const booking = JSON.parse(sessionStorage.getItem("booking"));

  if (!booking) {
    alert("Booking data missing");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Payment failed");
      return;
    }

    // ✅ Success
    sessionStorage.removeItem("booking");

    alert("✅ Payment successful! Booking confirmed.");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Server error during payment");
  }
}

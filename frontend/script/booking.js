// booking.js — FINAL STABLE VERSION ✅

const params = new URLSearchParams(window.location.search);

// 🔹 Read params safely
const beds = Number(params.get("beds"));
const roomId = params.get("roomId");
const price = Number(params.get("price"));
const checkIn = params.get("checkIn");
const checkOut = params.get("checkOut");

const guestsDiv = document.getElementById("guests");

// ❌ Hard stop if critical data missing
if (!beds || !roomId || !price || !checkIn || !checkOut) {
  alert("Invalid booking details. Redirecting...");
  window.location.href = "index.html";
}

// 🧑‍🤝‍🧑 Create guest input fields
for (let i = 0; i < beds; i++) {
  guestsDiv.innerHTML += `
    <div class="guest">
      <input class="guest-name" type="text" placeholder="Guest ${i + 1} Name" required>
      <input class="guest-age" type="number" placeholder="Age" required>
    </div>
  `;
}

// 📆 Calculate number of nights (ALWAYS integer ≥ 1)
function nights() {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const diff =
    Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

  return Math.max(1, diff);
}

// 📦 Collect guest details
function collectGuests() {
  const names = document.querySelectorAll(".guest-name");
  const ages = document.querySelectorAll(".guest-age");

  const list = [];
  for (let i = 0; i < names.length; i++) {
    list.push({
      name: names[i].value.trim(),
      age: Number(ages[i].value)
    });
  }
  return list;
}

// ➡️ Proceed to payment
function proceedToPayment() {
  const customerName = document.getElementById("customerName").value.trim();
   localStorage.setItem("customerName", customerName);

  if (!customerName) {
    alert("Enter booking name");
    return;
  }

  const guests = collectGuests();

  if (guests.some(g => !g.name || !g.age)) {
    alert("Fill all guest details correctly");
    return;
  }

  const totalAmount = price * nights();

  // 💾 Store booking draft safely
  sessionStorage.setItem(
    "booking",
    JSON.stringify({
      roomId,
      customerName,
      walletOwner: customerName, // 🔑 backend needs this
      bedsRequired: beds,
      guests,
      checkIn,
      checkOut,
      totalAmount
    })
  );

  window.location.href = "payment.html";
}

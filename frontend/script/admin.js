fetch("http://localhost:3000/bookings")
.then(r=>r.json())
.then(b=>{
 b.forEach(x=>{
   list.innerHTML+=`
   <div>${x.customerName}
   <button onclick="cancel('${x._id}')">Cancel</button></div>`;
 });
});

function cancel(id){
 fetch(`http://localhost:3000/bookings/${id}`,{method:"DELETE"})
 .then(()=>location.reload());
}

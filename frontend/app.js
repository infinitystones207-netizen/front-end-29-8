const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Payment button (Stripe Checkout via backend)
const payBtn = document.getElementById('payBtn');
const payMsg = document.getElementById('payMsg');
if (payBtn){
  payBtn.addEventListener('click', async () => {
    payMsg.textContent = 'Creating checkout…';
    try{
      const res = await fetch('/api/create-checkout-session', {method:'POST'});
      const data = await res.json();
      if (data.url){ window.location = data.url; }
      else { payMsg.textContent = data.error || 'Failed to start checkout'; }
    }catch(err){
      payMsg.textContent = 'Error: ' + err.message;
    }
  });
}

// Lead test form
const leadForm = document.getElementById('leadForm');
const leadMsg = document.getElementById('leadMsg');
if (leadForm){
  leadForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const form = new FormData(leadForm);
    const payload = Object.fromEntries(form.entries());
    leadMsg.textContent = 'Sending…';
    const res = await fetch('/api/missed-call', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ from: payload.phone, testLead: payload })
    });
    const data = await res.json();
    leadMsg.textContent = data.ok ? 'Lead captured!' : (data.error || 'Failed.');
  });
}

// Dashboard load
async function loadStats(){
  const res = await fetch('/api/stats');
  const data = await res.json();
  const customersCountEl = document.getElementById('customersCount');
  const revenueEl = document.getElementById('revenue');
  const leadsTableBody = document.querySelector('#leadsTable tbody');
  if (customersCountEl) customersCountEl.textContent = data.customers || 0;
  if (revenueEl) revenueEl.textContent = `$${(220*(data.customers||0)).toLocaleString()}`;
  if (leadsTableBody){
    leadsTableBody.innerHTML = '';
    (data.leads||[]).forEach(l=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${new Date(l.created_at).toLocaleString()}</td>
                      <td>${l.name||''}</td>
                      <td>${l.phone||''}</td>
                      <td>${l.email||''}</td>
                      <td>${l.message||''}</td>`;
      leadsTableBody.appendChild(tr);
    });
  }
}
loadStats();

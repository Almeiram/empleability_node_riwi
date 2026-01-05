const API = 'http://localhost:3000';
let token = null;

document.getElementById('register').onclick = async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(API + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  alert(await res.text());
};

document.getElementById('login').onclick = async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch(API + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.access_token) {
    token = data.access_token;
    alert('Login ok');
  } else {
    alert('Login failed');
  }
};

document.getElementById('load').onclick = async () => {
  const res = await fetch(API + '/vacancies');
  const data = await res.json();
  const list = data.data || data;
  const container = document.getElementById('vacancies');
  container.innerHTML = '';
  list.forEach((v) => {
    const div = document.createElement('div');
    div.className = 'vacancy';
    div.innerHTML = `<strong>${v.title}</strong><div>${v.description}</div><div>Company: ${v.company}</div><div>Max: ${v.maxApplicants}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Postularme';
    btn.onclick = async () => {
      if (!token) return alert('Login requerido');
      const r = await fetch(API + '/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ vacancyId: v.id }),
      });
      const d = await r.json();
      alert(d.message || JSON.stringify(d));
    };
    div.appendChild(btn);
    container.appendChild(div);
  });
};


const url = 'https://motor-match.genplusinnovations.com/api/admin/login/';

async function testJson() {
  console.log('Testing JSON payload...');
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
    });
    console.log('JSON Status:', res.status);
    const text = await res.text();
    console.log('JSON Response:', text.substring(0, 500));
  } catch (e) {
    console.error('JSON Error:', e.message);
  }
}

async function testForm() {
  console.log('Testing Form payload...');
  try {
    const params = new URLSearchParams();
    params.append('email', 'test@example.com');
    params.append('password', 'wrong');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    console.log('Form Status:', res.status);
    const text = await res.text();
    console.log('Form Response:', text.substring(0, 500));
  } catch (e) {
    console.error('Form Error:', e.message);
  }
}

async function testJsonWithRole() {
  console.log('Testing JSON payload with role...');
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong', role: 'dealer' })
    });
    console.log('JSON+Role Status:', res.status);
    const text = await res.text();
    console.log('JSON+Role Response:', text.substring(0, 500));
  } catch (e) {
    console.error('JSON+Role Error:', e.message);
  }
}

async function run() {
  await testJson();
  await testForm();
  await testJsonWithRole();
}
run();

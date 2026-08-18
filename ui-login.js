(()=>{
  const q=id=>document.getElementById(id);
  const gate=q('appGate'), dash=q('dashboard'), notice=q('gateNotice');
  const enc=new TextEncoder();
  async function sha(v){const b=await crypto.subtle.digest('SHA-256',enc.encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  function currentUser(){try{return JSON.parse(localStorage.getItem('bdto_app_user')||'null')}catch{return null}}
  function setScreen(logged,user){gate.classList.toggle('hidden',logged);dash.classList.toggle('hidden',!logged);if(logged)q('appUserBadge').textContent=`Masuk sebagai ${user||'Buzzer1'}`}
  function msg(t,ok=false){notice.textContent=t;notice.style.color=ok?'#7cf2b1':'#ffb6c4'}
  q('showRegisterBtn').onclick=()=>{q('loginForm').classList.add('hidden');q('registerForm').classList.remove('hidden');msg('')};
  q('showLoginBtn').onclick=()=>{q('registerForm').classList.add('hidden');q('loginForm').classList.remove('hidden');msg('')};
  q('appRegisterBtn').onclick=async()=>{const user=q('appRegisterUser').value.trim(),pw=q('appRegisterPassword').value;if(user.length<2)return msg('Nama pengguna minimal 2 karakter.');if(pw.length<6)return msg('Password minimal 6 karakter.');localStorage.setItem('bdto_app_user',JSON.stringify({user,hash:await sha(pw)}));q('appLoginUser').value=user;q('appLoginPassword').value='';q('registerForm').classList.add('hidden');q('loginForm').classList.remove('hidden');msg('Akun akses dashboard dibuat. Silakan login.',true)};
  q('appLoginBtn').onclick=async()=>{const saved=currentUser();if(!saved)return msg('Belum ada akun akses. Klik “Daftar sekarang” terlebih dahulu.');const user=q('appLoginUser').value.trim(),pw=q('appLoginPassword').value;if(user!==saved.user||await sha(pw)!==saved.hash)return msg('ID atau password dashboard tidak cocok.');sessionStorage.setItem('bdto_app_logged_in','1');setScreen(true,saved.user);startTyping()};
  q('appLogoutBtn').onclick=()=>{sessionStorage.removeItem('bdto_app_logged_in');setScreen(false);q('appLoginPassword').value='';msg('')};
  let typingRun=0;
  function startTyping(){
    const el=q('typingTitle'); if(!el)return;
    const run=++typingRun, full='BUZZER DIVTELEGRAM ONE';
    let i=0, deleting=false;
    el.textContent='';
    const step=()=>{
      if(run!==typingRun)return;
      if(!deleting){
        i++; el.textContent=full.slice(0,i);
        if(i>=full.length){deleting=true;return setTimeout(step,1500)}
        return setTimeout(step,90);
      }
      i--; el.textContent=full.slice(0,i);
      if(i<=0){deleting=false;return setTimeout(step,450)}
      setTimeout(step,45);
    };
    step();
  }
  const saved=currentUser();if(saved)q('appLoginUser').value=saved.user;
  const logged=sessionStorage.getItem('bdto_app_logged_in')==='1'&&!!saved;setScreen(logged,saved?.user);if(logged)startTyping();
})();

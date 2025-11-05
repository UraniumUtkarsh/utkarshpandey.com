/* All JS for lockscreen, carousel, cards and video popup */
(function () {
  // ====== CONFETTI / FLOATING ICON EFFECT ======
  function showBlaster() {
    const colours = ['🎂', '🎈', '🎉', '🥳', '✨'];
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('span');
      s.className = 'floatIcon';
      s.style.left = (20 + Math.random() * 60) + '%';
      s.style.top = (10 + Math.random() * 30) + '%';
      s.style.fontSize = (12 + Math.random() * 20) + 'px';
      s.textContent = colours[Math.floor(Math.random() * colours.length)];
      s.style.opacity = 0.95;
      s.style.transform = 'translateY(0)';
      document.body.appendChild(s);
      (function (el) {
        setTimeout(() => {
          el.style.transition = 'transform 2.2s ease-out, opacity 2.2s';
          el.style.transform = 'translateY(120vh) rotate(' + (Math.random() * 720) + 'deg)';
          el.style.opacity = 0;
        }, 50);
        setTimeout(() => el.remove(), 2600);
      })(s);
    }
  }

// ====== LOCK SCREEN ======
const PASSCODE = '0611';
const lockscreen = document.getElementById('lockscreen');
const app = document.getElementById('app');
const unlockBtn = document.getElementById('unlockBtn');
const passcodeInput = document.getElementById('passcode'); // ✅ Correct ID
const lockMsg = document.getElementById('lockMsg');

unlockBtn.addEventListener('click', () => {
  const val = passcodeInput.value.trim();
  if (val === PASSCODE) {
    lockscreen.classList.add('hidden');
    app.classList.remove('hidden');
    lockMsg.textContent = '';
    const bg = document.getElementById('bgAudio');
    if (bg) {
      bg.volume = 0.35;
      bg.play().catch(() => {});
    }
    showBlaster();
  } else {
    lockMsg.textContent = 'Incorrect. Tip: DDMM of the birthday.';
  }
});

passcodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockBtn.click();
});


  // ====== CAROUSEL ======
  const carousel = document.getElementById('carousel');
  const imgs = carousel.querySelectorAll('img');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  let idx = 0;
  function show(i) {
    imgs.forEach((im, j) => im.classList.toggle('active', i === j));
  }
  prev.onclick = () => {
    idx = (idx - 1 + imgs.length) % imgs.length;
    show(idx);
  };
  next.onclick = () => {
    idx = (idx + 1) % imgs.length;
    show(idx);
  };
  let carTimer = setInterval(() => {
    next.onclick();
  }, 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(carTimer));
  carousel.addEventListener('mouseleave', () => carTimer = setInterval(() => next.onclick(), 5000));

  // ====== WISH CARDS ======
  const wishes = [
    { from: 'Anshuma', avatar: 'assets/images/anshuma.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/anshuma.mp4' },
    { from: 'Utkarsh', avatar: 'assets/images/utkarsh.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/utkarsh.mp4' },
    { from: 'Saurabh', avatar: 'assets/images/saurabh.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/saurabh.mp4' },
    { from: 'Dhanushree', avatar: 'assets/images/dhanushree.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/dhanushree.mp4' },
    { from: 'Hirday', avatar: 'assets/images/hirday.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/hirday.mp4' },
    { from: 'Kesar', avatar: 'assets/images/kesar.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/kesar.mp4' },
    { from: 'Nitin', avatar: 'assets/images/nitin.jpg', short: 'Message here', note: 'Message here', video: 'assets/videos/nitin.mp4' }
  ];

  const grid = document.getElementById('wishesGrid');
  function makeCard(w) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `
      <div class='meta'>
        <div class='avatar'><img src='${w.avatar}' alt='${w.from}'></div>
        <div>
          <div class='from'>${w.from}</div>
          <div class='msg'>${w.short}</div>
        </div>
      </div>
      <div style='margin-top:10px;color:var(--muted)'>${w.note}</div>
    `;
    d.addEventListener('mouseenter', () => openVideo(w.video));
    d.addEventListener('click', () => openVideo(w.video));
    return d;
  }
  wishes.forEach(w => grid.appendChild(makeCard(w)));

  // ====== VIDEO POPUP ======
  let videoFrame = document.createElement('div');
  videoFrame.className = 'video-frame';
  videoFrame.innerHTML = "<button class='video-close'>✕</button><video controls playsinline></video>";
  document.body.appendChild(videoFrame);
  const vclose = videoFrame.querySelector('.video-close');
  const vtag = videoFrame.querySelector('video');

  function openVideo(src) {
    vtag.src = src;
    vtag.currentTime = 0;
    vtag.play().catch(() => {});
    videoFrame.classList.add('show');
  }

  function closeVideo() {
    vtag.pause();
    vtag.src = '';
    videoFrame.classList.remove('show');
  }

  vclose.addEventListener('click', closeVideo);
  videoFrame.addEventListener('click', e => { if (e.target === videoFrame) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

})(); // <-- closes the IIFE correctly

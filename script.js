/* NAAVICK LEGAL — Global JS */

// ─── NAV SCROLL ───
const nav = document.getElementById('siteNav');
if(nav && !nav.classList.contains('light')){
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, {passive:true});
}

// ─── REVEAL ON SCROLL ───
const reveals = document.querySelectorAll('.reveal');
if(reveals.length){
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, {threshold:0.1, rootMargin:'0px 0px -50px 0px'});
  reveals.forEach(el => ro.observe(el));
}

// ─── LINKEDIN IFRAME LAZY LOAD ───
(function(){
  var carousel = document.getElementById('dealsCarousel');
  if(!carousel) return;
  var loaded = false;
  var io = new IntersectionObserver(function(entries){
    if(loaded || !entries[0].isIntersecting) return;
    loaded = true;
    io.disconnect();
    carousel.querySelectorAll('iframe[data-src]').forEach(function(f){
      f.src = f.getAttribute('data-src');
    });
  }, {rootMargin:'200px'});
  io.observe(carousel);
})();

// ─── MOBILE MENU ───
function openMenu(){
  const m = document.getElementById('mobileMenu');
  if(m) m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu(){
  const m = document.getElementById('mobileMenu');
  if(m) m.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── PAGE TRANSITION ───
(function(){

  var ov = document.createElement('div');
  ov.id = 'pt';
  var wh = document.createElement('div');
  wh.id = 'pt-w';
  wh.setAttribute('aria-hidden','true');
  ov.appendChild(wh);
  document.body.appendChild(ov);

  var busy = false;
  var PERIOD = 22000; // ms per full rotation

  // Restore angle accounting for time elapsed during page load
  var savedAngle = parseFloat(sessionStorage.getItem('pt-angle') || '0');
  var savedTime  = parseInt(sessionStorage.getItem('pt-time')  || '0');
  var angle = savedAngle + (savedTime ? ((Date.now() - savedTime) / PERIOD * 360) : 0);
  var lastTs = null;

  // JS-driven rotation — angle is continuous across page navigations
  function spinLoop(ts){
    if(lastTs !== null){
      angle = (angle + (ts - lastTs) / PERIOD * 360) % 360;
      wh.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
    }
    lastTs = ts;
    requestAnimationFrame(spinLoop);
  }
  requestAnimationFrame(spinLoop);

  // ── EXIT: overlay + wheel fade in; navigate once overlay is fully opaque ──
  function exit(href){
    if(busy) return;
    busy = true;

    ov.classList.add('pt-visible');
    wh.style.transition = 'opacity 340ms ease';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        wh.style.opacity = '1';
      });
    });

    setTimeout(function(){
      sessionStorage.setItem('pt',      '1');
      sessionStorage.setItem('pt-angle', angle.toFixed(2));
      sessionStorage.setItem('pt-time',  Date.now().toString());
      window.location.href = href;
    }, 420);
  }

  // ── ENTER: overlay starts opaque, dissolves to reveal new page ──
  function enter(){
    wh.style.transition = 'none';
    wh.style.opacity    = '1';
    ov.style.transition = 'none';
    ov.classList.add('pt-visible');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        wh.style.transition = 'opacity 400ms ease 60ms';
        ov.style.transition = 'opacity 460ms cubic-bezier(0.4,0,0.2,1) 60ms';
        wh.style.opacity    = '0';
        ov.classList.remove('pt-visible');
      });
    });
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if(!a) return;
    var href = a.getAttribute('href');
    var tgt  = a.getAttribute('target');
    if(!href || tgt==='_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if(/^(https?:|mailto:|tel:|#)/.test(href)) return;
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if(href === page || href === './'+page) return;
    e.preventDefault();
    exit(href);
  });

  if(sessionStorage.getItem('pt')){
    sessionStorage.removeItem('pt');
    sessionStorage.removeItem('pt-angle');
    sessionStorage.removeItem('pt-time');
    enter();
  }

})();

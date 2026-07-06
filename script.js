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
  const isMobile = window.innerWidth <= 600;
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, {threshold:0.06, rootMargin: isMobile ? '0px 0px -24px 0px' : '0px 0px -64px 0px'});
  reveals.forEach(el => {
    // Elements already in viewport on page load reveal instantly — no flash of invisible content
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight && r.bottom > 0){
      el.classList.add('visible');
    } else {
      ro.observe(el);
    }
  });
}

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

    ov.classList.add('pt-active');
    ov.classList.add('pt-visible');
    wh.style.transition = 'opacity 360ms cubic-bezier(0.25,0.46,0.45,0.94)';
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
    }, 460);
  }

  // ── ENTER: overlay starts opaque, dissolves to reveal new page ──
  function enter(){
    ov.classList.add('pt-active');
    wh.style.transition = 'none';
    wh.style.opacity    = '1';
    ov.style.transition = 'none';
    ov.classList.add('pt-visible');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        wh.style.transition = 'opacity 480ms cubic-bezier(0.25,0.46,0.45,0.94) 40ms';
        ov.style.transition = 'opacity 520ms cubic-bezier(0.25,0.46,0.45,0.94) 40ms';
        wh.style.opacity    = '0';
        ov.classList.remove('pt-visible');
        // Once fade-out completes, pull it fully off the render tree
        setTimeout(function(){ ov.classList.remove('pt-active'); }, 580);
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

// ─── PAPER GRAIN TEXTURE ───
(function(){
  var g = document.createElement('div');
  g.id = 'nl-grain';
  g.setAttribute('aria-hidden','true');
  document.body.appendChild(g);
})();

// ─── LIVE CLOCK ───
(function(){
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function pad(n){ return n < 10 ? '0'+n : ''+n; }
  function fmt(d){
    return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  var p = document.createElement('p');
  p.id = 'nl-clock';
  var fb = document.querySelector('.footer-bottom');
  if(!fb) return;
  fb.appendChild(p);
  function tick(){ p.textContent = fmt(new Date()); }
  tick();
  setInterval(tick, 1000);
})();

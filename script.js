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

  function snapWheel(deg, sc, op){
    wh.style.transition = 'none';
    wh.style.transform  = 'rotate('+deg+'deg) scale('+sc+')';
    wh.style.opacity    = String(op);
  }

  // ── EXIT: frosted overlay appears, wheel fades in with subtle rotation, navigate ──
  function exit(href){
    if(busy) return;
    busy = true;

    snapWheel(-5, 0.9, 0);
    ov.classList.add('pt-visible');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        wh.style.transition = 'opacity 360ms ease, transform 700ms cubic-bezier(0.25,0,0.1,1)';
        wh.style.opacity    = '1';
        wh.style.transform  = 'rotate(6deg) scale(1)';

        setTimeout(function(){
          sessionStorage.setItem('pt','1');
          window.location.href = href;
        }, 760);
      });
    });
  }

  // ── ENTER: frosted overlay with completed wheel dissolves, new page revealed ──
  function enter(){
    snapWheel(6, 1, 1);
    ov.style.transition = 'none';
    ov.classList.add('pt-visible');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        ov.style.transition = 'opacity 400ms cubic-bezier(0.25,0,0.1,1) 80ms';
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
    enter();
  }

})();

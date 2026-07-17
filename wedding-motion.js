(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (s,c=document) => c.querySelector(s);
  const qa = (s,c=document) => [...c.querySelectorAll(s)];
  const progress = q('.scroll-progress');
  let ticking = false;

  const clamp = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
  function render(){
    ticking = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(scrollY / max);
    document.documentElement.style.setProperty('--page-scroll', p.toFixed(4));
    if(progress) progress.style.transform = `scaleX(${p})`;
    if(reduce) return;

    qa('[data-parallax]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = Number(el.dataset.parallax || .25);
      const offset = (rect.top + rect.height/2 - innerHeight/2) * speed * -.16;
      el.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    });
    qa('[data-scroll-rotate]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const local = clamp(1 - rect.top / innerHeight);
      const from = Number(el.dataset.scrollRotate || -7);
      el.style.setProperty('--scroll-rotate', `${from + local * Math.abs(from)}deg`);
    });
    qa('[data-scroll-scale]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = 1 - Math.abs((rect.top + rect.height/2 - innerHeight/2) / innerHeight);
      el.style.setProperty('--scroll-scale', String(.92 + clamp(center) * .08));
    });
    qa('[data-draw]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const local = clamp((innerHeight - rect.top) / (innerHeight + rect.height * .55));
      el.style.setProperty('--draw-progress', local.toFixed(4));
    });
    qa('[data-horizontal-track]').forEach(track => {
      const host = track.closest('[data-horizontal-host]');
      if(!host) return;
      const rect = host.getBoundingClientRect();
      const range = Math.max(1, host.offsetHeight - innerHeight);
      const local = clamp(-rect.top / range);
      const maxX = Math.max(0, track.scrollWidth - innerWidth + 48);
      track.style.transform = `translate3d(${-local * maxX}px,0,0)`;
    });
  }
  function request(){ if(!ticking){ ticking=true; requestAnimationFrame(render); } }
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request); request();

  if('IntersectionObserver' in window){
    const stepObserver = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){
        const group = e.target.closest('[data-step-group]');
        if(group) qa('[data-step]', group).forEach(x => x.classList.toggle('is-active', x === e.target));
      }
    }), {rootMargin:'-38% 0px -38% 0px', threshold:.01});
    qa('[data-step]').forEach(x => stepObserver.observe(x));
  }
})();
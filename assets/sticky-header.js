(() => {
  const header = document.querySelector('[data-sticky-header]');
  const hero   = document.querySelector('#hero');
  if (!header || !hero) return;           // bail out on non-home pages

  function watch() {
    const margin = `-${header.offsetHeight}px 0px 0px 0px`;
    const io = new IntersectionObserver(
      ([entry]) => {
        const pastHero = !entry.isIntersecting;
        header.classList.toggle('is-scrolled', pastHero);
        document.body.classList.toggle('has-shrunk-header', pastHero);
      },
      { rootMargin: margin, threshold: 0 }
    );
    io.observe(hero);
    return io;
  }

  let io = watch();
  window.addEventListener('resize', () => { io.disconnect(); io = watch(); });
})();

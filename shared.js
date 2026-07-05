
const target = new Date("2027-08-20T14:00:00+02:00").getTime();
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));
function pad(n){ return String(n).padStart(2,"0"); }
function tick(){
  const diff = Math.max(0, target - Date.now());
  const vals = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff % 86400000 / 3600000),
    mins: Math.floor(diff % 3600000 / 60000),
    secs: Math.floor(diff % 60000 / 1000)
  };
  $$("[data-count]").forEach(el => {
    const key = el.dataset.count;
    el.textContent = key === "days" ? vals[key] : pad(vals[key]);
  });
}
tick();
setInterval(tick, 1000);

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  $$(".reveal").forEach(el => io.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("show"));
}

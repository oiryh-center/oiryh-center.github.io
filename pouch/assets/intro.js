// 노치를 누르면 패널이 펼쳐지며 문장이 적히고, 그 아래에 메인 창이 나타난다.
// 스크립트가 없으면 창이 처음부터 보인다(.js 클래스가 없을 때).
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const notch = document.querySelector(".notch");
  const stage = document.querySelector(".stage");
  const typed = notch.querySelector(".typed");
  const text = typed.dataset.text;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;

  const type = () => {
    clearInterval(timer);
    if (reduce) { typed.textContent = text; return; }
    typed.textContent = "";
    let i = 0;
    timer = setInterval(() => {
      typed.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(timer);
    }, 55);
  };

  const setOpen = (open) => {
    notch.setAttribute("aria-expanded", String(open));
    stage.classList.toggle("opened", open);
    if (open) type(); else clearInterval(timer);
  };

  notch.addEventListener("click", () => setOpen(notch.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && notch.getAttribute("aria-expanded") === "true") { setOpen(false); notch.focus(); }
  });
});

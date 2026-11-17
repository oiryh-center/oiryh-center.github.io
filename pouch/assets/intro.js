// 노치를 누르면 패널이 펼쳐지며 문장이 적히고, 그 아래에 메인 창이 나타난다.
// 다 적힌 뒤 한 번 더 누르면(Return도 같다) 문장이 카드가 되어 Inbox 맨 위에 담긴다.
// 그다음 누르거나 Esc를 누르면 닫히고, 다시 열면 처음부터 시작한다.
// 스크립트가 없으면 창이 처음부터 보인다(.js 클래스가 없을 때).
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const notch = document.querySelector(".notch");
  const stage = document.querySelector(".stage");
  const typed = notch.querySelector(".typed");
  const cards = notch.querySelector(".cards");
  const more = notch.querySelector(".more");
  const inbox = document.querySelector("#inbox h2");
  const text = typed.dataset.text;
  const original = cards.innerHTML;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // closed → typing → ready → saved
  let state = "closed";
  let timer;

  const ready = () => { state = "ready"; notch.classList.add("ready"); };

  const type = () => {
    state = "typing";
    if (reduce) { typed.textContent = text; ready(); return; }
    typed.textContent = "";
    let i = 0;
    timer = setInterval(() => {
      typed.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(timer); ready(); }
    }, 55);
  };

  // 노치 Inbox는 앱처럼 두 장만 보이고, 나머지는 +N으로 센다.
  const save = () => {
    state = "saved";
    notch.classList.remove("ready");
    typed.textContent = "";
    const card = document.createElement("span");
    card.className = "ncard new";
    card.textContent = text;
    cards.prepend(card);
    cards.lastElementChild.remove();
    more.textContent = "+1";
    const row = document.createElement("p");
    row.className = "new";
    row.textContent = text;
    inbox.after(row);
  };

  const close = () => {
    clearInterval(timer);
    state = "closed";
    notch.classList.remove("ready");
    notch.setAttribute("aria-expanded", "false");
    stage.classList.remove("opened");
    typed.textContent = "";
    cards.innerHTML = original;
    more.textContent = "";
    document.querySelectorAll(".area p.new").forEach((p) => p.remove());
  };

  notch.addEventListener("click", () => {
    if (state === "closed") {
      notch.setAttribute("aria-expanded", "true");
      stage.classList.add("opened");
      type();
    } else if (state === "ready") {
      save();
    } else if (state === "saved") {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state !== "closed") { close(); notch.focus(); }
    else if (e.key === "Enter" && state === "ready" && document.activeElement !== notch) save();
  });
});

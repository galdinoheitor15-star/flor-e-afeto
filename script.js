/* ==========================================================
   Flor & Afeto — interações do site
   ========================================================== */

/* ---------- CONFIGURAÇÃO (edite aqui) ---------- */
const CONFIG = {
  whatsapp: "5581993999717",
  // Horário de funcionamento: 0 = domingo ... 6 = sábado. Use null para "fechado".
  // Preencha com o horário real (destaque "Horário" do Instagram) para ativar o aviso "Aberto agora".
  hours: null,
  // Exemplo:
  // hours: { 0: null, 1: ["08:00","18:00"], 2: ["08:00","18:00"], 3: ["08:00","18:00"],
  //          4: ["08:00","18:00"], 5: ["08:00","18:00"], 6: ["08:00","13:00"] },
};

const IMG = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- CATÁLOGO (edite produtos, fotos e preços) ----------
   price: deixe null para mostrar "sob consulta", ou coloque o valor, ex.: 149.9 */
const PRODUCTS = [
  { id: "buque-rosas", cat: "flores", tag: "Mais pedido", name: "Buquê de Rosas", price: null,
    img: IMG("photo-1563241527-3004b7be0ffd"),
    desc: "Rosas selecionadas, folhagens e papel de seda em embalagem delicada.",
    items: ["Rosas nas cores à sua escolha", "Folhagens naturais", "Cartão com mensagem"] },
  { id: "buque-campestre", cat: "flores", name: "Buquê Campestre", price: null,
    img: IMG("photo-1561181286-d3fee7d55364"),
    desc: "Mix de flores da estação com ar romântico e leve.",
    items: ["Flores da estação", "Composição exclusiva", "Laço de cetim"] },
  { id: "arranjo-mesa", cat: "flores", name: "Arranjo para Mesa", price: null,
    img: IMG("photo-1487530811176-3780de880c2d"),
    desc: "Arranjo em vaso para decorar casa, escritório ou eventos.",
    items: ["Vaso decorativo", "Flores frescas", "Ideal para inaugurações"] },
  { id: "rosa-unica", cat: "flores", name: "Rosa Encantada", price: null,
    img: IMG("photo-1526047932273-341f2a7631f9"),
    desc: "Uma única rosa em embalagem especial: simples e inesquecível.",
    items: ["Rosa individual", "Embalagem premium", "Tag personalizada"] },
  { id: "cafe-classico", cat: "cafe", tag: "Favorito", name: "Café da Manhã Clássico", price: null,
    img: IMG("photo-1533089860892-a7c6f0a88666"),
    desc: "Cesta com pães, frios, frutas, bolo, suco e mimos para um despertar especial.",
    items: ["Pães, frios e frutas", "Bolo e doces", "Suco ou achocolatado", "Decoração temática"] },
  { id: "cafe-romantico", cat: "cafe", name: "Café da Manhã Romântico", price: null,
    img: IMG("photo-1484723091739-30a097e8f929"),
    desc: "Versão para casais, com flores, balão e cartão apaixonado.",
    items: ["Itens para duas pessoas", "Flores naturais", "Balão e cartão"] },
  { id: "cesta-chocolate", cat: "cestas", name: "Cesta de Chocolates", price: null,
    img: IMG("photo-1549007994-cb92caebd54b"),
    desc: "Seleção de chocolates e guloseimas em cesta decorada.",
    items: ["Chocolates variados", "Caneca ou pelúcia (opcional)", "Laço e cartão"] },
  { id: "kit-presente", cat: "cestas", tag: "Personalizável", name: "Kit Presente Criativo", price: null,
    img: IMG("photo-1549465220-1a8b9238cd48"),
    desc: "Monte um kit com a cara de quem vai receber: você escolhe, a gente cria.",
    items: ["Itens à escolha", "Embalagem personalizada", "Ideal para qualquer ocasião"] },
  { id: "cesta-pelucia", cat: "cestas", name: "Cesta com Pelúcia", price: null,
    img: IMG("photo-1559454403-b8fb88521f11"),
    desc: "Pelúcia fofinha acompanhada de doces e flores.",
    items: ["Pelúcia", "Doces selecionados", "Flores ou balão"] },
  { id: "balao-personalizado", cat: "decor", name: "Balão Personalizado", price: null,
    img: IMG("photo-1530103862676-de8c9debad1d"),
    desc: "Balão bubble com nome ou frase, recheado ou com flores.",
    items: ["Frase personalizada", "Opção com confetes ou flores", "Fita e peso decorativo"] },
  { id: "box-surpresa", cat: "decor", name: "Box Surpresa", price: null,
    img: IMG("photo-1513885535751-8b9238bd345a"),
    desc: "Caixa que se abre revelando balões, fotos e mimos.",
    items: ["Caixa decorada", "Balões", "Espaço para fotos e mensagem"] },
  { id: "decor-evento", cat: "decor", name: "Decoração de Ambiente", price: null,
    img: IMG("photo-1519225421980-715cb0215aed"),
    desc: "Decoração floral e com balões para pedidos, aniversários e eventos.",
    items: ["Projeto sob medida", "Flores e balões", "Montagem no local"] },
];

const CAT_LABEL = { flores: "Flores", cafe: "Café da manhã", cestas: "Cestas & presentes", decor: "Balões & decoração" };

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
const priceLabel = (p) => p == null ? "sob consulta" : p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// Fallback elegante para imagens que não carregarem
function guardImages(root = document) {
  $$("img", root).forEach((img) => {
    if (img.dataset.guarded) return;
    img.dataset.guarded = 1;
    const fail = () => img.parentElement.classList.add("img-fallback");
    if (img.complete && img.naturalWidth === 0 && img.src) fail();
    img.addEventListener("error", fail, { once: true });
  });
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ==========================================================
   LOADER
   ========================================================== */
(function loader() {
  const el = $("#loader");
  const bar = $(".loader-bar span");
  const petals = $(".loader-petals");
  const start = performance.now();
  const MIN = 2900;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 5 + Math.random() * 5 + "s";
    p.style.animationDelay = Math.random() * 3 + "s";
    p.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
    p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    p.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    petals.appendChild(p);
  }

  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 14, 92);
    bar.style.width = progress + "%";
  }, 220);

  const finish = () => {
    const wait = Math.max(0, MIN - (performance.now() - start));
    setTimeout(() => {
      clearInterval(tick);
      bar.style.width = "100%";
      setTimeout(() => {
        el.classList.add("done");
        document.body.classList.remove("is-loading");
        setTimeout(() => el.remove(), 1400);
        revealInit();
      }, 380);
    }, wait);
  };
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(finish.bind(null), 7000); // segurança caso alguma imagem demore
})();

/* ==========================================================
   CABEÇALHO / MENU
   ========================================================== */
const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $("#menuBtn"), nav = $("#mainNav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  document.body.classList.toggle("lock", open);
});
$$("a", nav).forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", false);
  document.body.classList.remove("lock");
}));

// Destaca o link da seção visível
const sections = ["colecoes", "catalogo", "ocasioes", "sobre", "contato"].map((id) => document.getElementById(id));
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) $$("a", nav).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => s && navObserver.observe(s));

/* ==========================================================
   REVEAL AO ROLAR
   ========================================================== */
let revealObserver;
function revealInit() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = $$(".reveal", e.target.parentElement);
      const idx = Math.max(0, siblings.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(idx * 80, 400) + "ms";
      e.target.classList.add("in");
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObserver.observe(el));
}

/* ==========================================================
   LINKS DE WHATSAPP
   ========================================================== */
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-wa]");
  if (!a) return;
  e.preventDefault();
  window.open(waLink(a.dataset.wa), "_blank", "noopener");
});

/* ==========================================================
   CATÁLOGO
   ========================================================== */
const grid = $("#products");
let filter = "all", query = "";

function renderProducts() {
  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (filter === "all" || p.cat === filter) &&
    (!q || (p.name + " " + p.desc + " " + CAT_LABEL[p.cat]).toLowerCase().includes(q)));
  grid.innerHTML = list.map((p, i) => `
    <article class="product" style="animation-delay:${i * 60}ms">
      <figure class="product-media" data-open="${p.id}">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="quick" data-open="${p.id}">Ver detalhes</button>
      </figure>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-foot">
          <span class="price">${priceLabel(p.price)}</span>
          <button class="add" data-add="${p.id}" aria-label="Adicionar ${p.name} à seleção">+</button>
        </div>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
  guardImages(grid);
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  setFilter(b.dataset.filter);
});
function setFilter(f) {
  filter = f;
  $$(".chip").forEach((c) => {
    const on = c.dataset.filter === f;
    c.classList.toggle("active", on);
    c.setAttribute("aria-selected", on);
  });
  renderProducts();
}
$("#search").addEventListener("input", (e) => { query = e.target.value; renderProducts(); });

// Coleções levam ao catálogo filtrado
$$("[data-goto]").forEach((a) => a.addEventListener("click", () => setFilter(a.dataset.goto)));

grid.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    addToCart(add.dataset.add, 1);
    add.classList.add("added");
    add.textContent = "✓";
    setTimeout(() => { add.classList.remove("added"); add.textContent = "+"; }, 1200);
    return;
  }
  const open = e.target.closest("[data-open]");
  if (open) openModal(open.dataset.open);
});

/* ==========================================================
   MODAL DE PRODUTO
   ========================================================== */
const modal = $("#modal");
let current = null, qty = 1;
function openModal(id) {
  current = PRODUCTS.find((p) => p.id === id);
  if (!current) return;
  qty = 1; $("#qVal").textContent = qty;
  const img = $("#mImg");
  img.parentElement.classList.remove("img-fallback");
  img.dataset.guarded = "";
  img.src = current.img; img.alt = current.name;
  guardImages(modal);
  $("#mCat").textContent = CAT_LABEL[current.cat] + " · " + priceLabel(current.price);
  $("#mTitle").textContent = current.name;
  $("#mDesc").textContent = current.desc;
  $("#mList").innerHTML = current.items.map((i) => `<li>${i}</li>`).join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  $("#mAdd").focus({ preventScroll: true });
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (!drawer.classList.contains("open")) document.body.classList.remove("lock");
}
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
$("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qVal").textContent = qty; });
$("#qPlus").addEventListener("click", () => { qty = Math.min(20, qty + 1); $("#qVal").textContent = qty; });
$("#mAdd").addEventListener("click", () => { addToCart(current.id, qty); closeModal(); });
$("#mWa").addEventListener("click", (e) => {
  e.preventDefault();
  window.open(waLink(`Olá, Flor & Afeto! Gostaria de saber mais sobre: ${current.name} 🌷`), "_blank", "noopener");
});

/* ==========================================================
   SELEÇÃO (CARRINHO) + PEDIDO PELO WHATSAPP
   ========================================================== */
const drawer = $("#drawer"), backdrop = $("#backdrop");
let cart = store.get("fa-cart", []).filter((c) => PRODUCTS.some((p) => p.id === c.id));

function saveCart() { store.set("fa-cart", cart); renderCart(); }
function addToCart(id, n) {
  const line = cart.find((c) => c.id === id);
  if (line) line.qty = Math.min(20, line.qty + n); else cart.push({ id, qty: n });
  saveCart();
  const p = PRODUCTS.find((x) => x.id === id);
  toast(`“${p.name}” adicionado à sua seleção ✿`);
  const c = $("#cartCount");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}
function renderCart() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const count = $("#cartCount");
  count.textContent = total;
  count.classList.toggle("show", total > 0);
  drawer.classList.toggle("is-empty", cart.length === 0);
  $("#cartItems").innerHTML = cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.id);
    return `<div class="cart-item">
      <img src="${p.img.replace("w=700", "w=200")}" alt="">
      <div><h4>${p.name}</h4>
        <div class="mini-qty"><button data-dec="${p.id}" aria-label="Diminuir">−</button>${c.qty}<button data-inc="${p.id}" aria-label="Aumentar">+</button></div>
      </div>
      <button class="rm" data-rm="${p.id}">remover</button>
    </div>`;
  }).join("");
}
$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const id = b.dataset.inc || b.dataset.dec || b.dataset.rm;
  const line = cart.find((c) => c.id === id);
  if (!line) return;
  if (b.dataset.inc) line.qty = Math.min(20, line.qty + 1);
  if (b.dataset.dec) line.qty -= 1;
  if (b.dataset.rm || line.qty < 1) cart = cart.filter((c) => c.id !== id);
  saveCart();
});

function openCart() {
  drawer.classList.add("open"); backdrop.classList.add("show");
  drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
}
function closeCart() {
  drawer.classList.remove("open"); backdrop.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock");
}
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
$("#browseBtn").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("open")) closeModal(); else if (drawer.classList.contains("open")) closeCart();
});

// Data mínima = hoje
const dateInput = $("#orderForm [name=data]");
const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().slice(0, 10);

$("#orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart.length) return;
  const f = new FormData(e.target);
  const lines = cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.id);
    return `• ${c.qty}x ${p.name}`;
  });
  let msg = `Olá, Flor & Afeto! 🌷\nGostaria de fazer um pedido pelo site:\n\n${lines.join("\n")}\n`;
  if (f.get("nome")) msg += `\nNome: ${f.get("nome")}`;
  if (f.get("data")) msg += `\nData desejada: ${f.get("data").split("-").reverse().join("/")}`;
  msg += `\nRecebimento: ${f.get("entrega")}`;
  if (f.get("cartao")) msg += `\nMensagem do cartão: "${f.get("cartao")}"`;
  msg += `\n\nPoderiam confirmar valores e disponibilidade? Obrigado(a)!`;
  window.open(waLink(msg), "_blank", "noopener");
});

/* ==========================================================
   OCASIÕES
   ========================================================== */
$$(".occasion").forEach((b) => b.addEventListener("click", () => {
  window.open(waLink(`Olá, Flor & Afeto! Estou procurando um presente para ${b.dataset.occ}. Podem me sugerir algumas opções? 🎁`), "_blank", "noopener");
}));

/* ==========================================================
   DEPOIMENTOS (carrossel)
   ========================================================== */
(function testimonials() {
  const track = $("#tTrack"), dots = $("#tDots");
  const n = track.children.length;
  let i = 0, timer;
  dots.innerHTML = Array.from({ length: n }, (_, k) => `<button aria-label="Depoimento ${k + 1}"></button>`).join("");
  const go = (k) => {
    i = (k + n) % n;
    track.style.transform = `translateX(-${i * 100}%)`;
    $$("button", dots).forEach((d, j) => d.classList.toggle("active", j === i));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); };
  dots.addEventListener("click", (e) => {
    const idx = $$("button", dots).indexOf(e.target);
    if (idx > -1) { go(idx); auto(); }
  });
  let x0 = null;
  track.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); auto(); }
    x0 = null;
  });
  go(0); auto();
})();

/* ==========================================================
   CONTADOR / HORÁRIO / ANO
   ========================================================== */
const counter = $("[data-count]");
new IntersectionObserver((entries, obs) => {
  if (!entries[0].isIntersecting) return;
  obs.disconnect();
  const target = +counter.dataset.count, t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1600);
    counter.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString("pt-BR") + (k === 1 ? "+" : "");
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}, { threshold: 0.6 }).observe(counter);

(function hours() {
  if (!CONFIG.hours) return;
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const now = new Date(), h = CONFIG.hours[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  const toMin = (s) => +s.slice(0, 2) * 60 + +s.slice(3);
  const open = h && mins >= toMin(h[0]) && mins < toMin(h[1]);
  const wk = CONFIG.hours[1];
  $("#hoursText").textContent = wk ? `Seg a Sex · ${wk[0]} às ${wk[1]}` + (CONFIG.hours[6] ? ` · Sáb ${CONFIG.hours[6][0]} às ${CONFIG.hours[6][1]}` : "") : "";
  const badge = $("#openNow");
  badge.className = "open-badge";
  badge.style.color = open ? "#5f8a5a" : "var(--rose-deep)";
  badge.textContent = open ? `Aberto agora · até ${h[1]}` : `Fechado agora (${days[now.getDay()]})`;
})();

$("#year").textContent = new Date().getFullYear();

/* ---------- Início ---------- */
renderProducts();
renderCart();
guardImages();

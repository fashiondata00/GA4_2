// ─── CUSTOM CURSOR ───
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// ─── NAV SCROLL ───
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ─── INTERSECTION OBSERVER (ANIMATE ON SCROLL) ───
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = (entry.target.dataset.delay || 0) + 'ms';
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// ─── CART MANAGEMENT ───
const getCart = () => JSON.parse(localStorage.getItem('maison_cart') || '[]');
const saveCart = (cart) => localStorage.setItem('maison_cart', JSON.stringify(cart));

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showCartNotification(product.name);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

function showCartNotification(name) {
  let notif = document.getElementById('cart-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'cart-notif';
    notif.style.cssText = `
      position:fixed; bottom:2rem; right:2rem; z-index:200;
      background:#0a0a0a; color:#f8f6f2;
      padding:1rem 1.8rem;
      font-family:'DM Sans',sans-serif;
      font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase;
      transform:translateY(100px); opacity:0;
      transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    `;
    document.body.appendChild(notif);
  }
  notif.textContent = name + ' — Added to Bag';
  notif.style.transform = 'translateY(0)';
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.transform = 'translateY(100px)';
    notif.style.opacity = '0';
  }, 2500);
}

// Initialize cart count on load
document.addEventListener('DOMContentLoaded', updateCartCount);

// ─── WISHLIST ───
const getWishlist = () => JSON.parse(localStorage.getItem('maison_wishlist') || '[]');
const saveWishlist = (list) => localStorage.setItem('maison_wishlist', JSON.stringify(list));

function toggleWishlist(productId, btn) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx > -1) {
    list.splice(idx, 1);
    if (btn) btn.style.opacity = '0.4';
  } else {
    list.push(productId);
    if (btn) btn.style.opacity = '1';
  }
  saveWishlist(list);
}

function initWishlistBtns() {
  const list = getWishlist();
  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    const id = btn.dataset.wishlist;
    btn.style.opacity = list.includes(id) ? '1' : '0.4';
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      toggleWishlist(id, btn);
    });
  });
}
document.addEventListener('DOMContentLoaded', initWishlistBtns);

// ─── SHARED NAV HTML ───
function renderNav(active) {
  const pages = [
    { href: 'women.html', label: 'Women' },
    { href: 'men.html', label: 'Men' },
    { href: 'blog.html', label: 'Journal' },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" ${active === p.href ? 'class="active"' : ''}>${p.label}</a></li>`
  ).join('');

  const navHTML = `
    <div class="cursor"></div>
    <div class="cursor-ring"></div>
    <nav>
      <a href="index.html" class="nav-logo">Maison</a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-icons">
        <a href="cart.html">Bag <span class="cart-count" style="display:none">0</span></a>
      </div>
    </nav>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  updateCartCount();
}

// ─── SHARED FOOTER HTML ───
function renderFooter() {
  const footerHTML = `
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo">Maison</span>
          <p>Curated fashion for the considered wardrobe. Timeless pieces that transcend seasons.</p>
        </div>
        <div class="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="women.html">Women</a></li>
            <li><a href="men.html">Men</a></li>
            <li><a href="blog.html">Journal</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Service</h5>
          <ul>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>About</h5>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Maison. All rights reserved.</p>
        <p>Privacy Policy · Terms of Service</p>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

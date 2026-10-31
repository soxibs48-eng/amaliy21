/**
 * Grover - Grocery Landing Page Main Application Script (Amaliy 21)
 * Interactive Cart, Search, Modals, VanillaTilt, GSAP Animations & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Initial State & Data
  // ==========================================
  let cart = [
    {
      id: 'orange-1',
      name: 'Fresh Organic Oranges (1kg)',
      price: 4.99,
      qty: 1,
      img: './assets/images/orange-card.png'
    },
    {
      id: 'strawberry-1',
      name: 'Farm Fresh Strawberries (500g)',
      price: 6.50,
      qty: 1,
      img: './assets/images/strawberry.png'
    }
  ];

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navItems = document.querySelectorAll('.nav-items .nav-item');
  const sections = document.querySelectorAll('section[id], footer[id]');
  
  // Search Elements
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  // Cart Elements
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  // Modals
  const processModal = document.getElementById('processModal');
  const openProcessModalBtn = document.getElementById('openProcessModalBtn');
  const closeProcessBtn = document.getElementById('closeProcessBtn');
  
  const orderModal = document.getElementById('orderModal');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
  const openOrderBtns = document.querySelectorAll('.open-order-modal-btn');
  
  const newsletterForm = document.getElementById('newsletterForm');
  const backToTopBtn = document.getElementById('backToTop');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // 2. Toast Notification Engine
  // ==========================================
  window.showToast = function(message, type = 'success', duration = 3500) {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    
    toast.innerHTML = `
      <i class="${iconClass} toast-icon" style="color: ${type === 'success' ? '#37B96C' : type === 'info' ? '#F86061' : '#FE7E00'}"></i>
      <span class="toast-msg">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  };

  // ==========================================
  // 3. Cart Management
  // ==========================================
  function updateCartUI() {
    // Calculate total quantity & amount
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    
    // Update badges
    if (cartCountBadge) {
      cartCountBadge.textContent = totalQty;
      cartCountBadge.classList.add('bounce');
      setTimeout(() => cartCountBadge.classList.remove('bounce'), 300);
    }
    if (cartDrawerCount) {
      cartDrawerCount.textContent = totalQty;
    }
    
    // Update Subtotal & Total
    const formattedTotal = `$${totalAmount.toFixed(2)}`;
    if (cartSubtotal) cartSubtotal.textContent = formattedTotal;
    if (cartTotal) cartTotal.textContent = formattedTotal;
    
    // Render Items
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: #8E8E8E;">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; margin-bottom: 14px; opacity: 0.3;"></i>
          <p style="font-size: 1.1rem; font-weight: 500;">Your cart is currently empty.</p>
          <p style="font-size: 0.9rem; margin-top: 6px;">Add some delicious organic produce!</p>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-qty-controls">
            <button class="qty-btn" onclick="decreaseQty('${item.id}')" aria-label="Decrease">&minus;</button>
            <span class="qty-count">${item.qty}</span>
            <button class="qty-btn" onclick="increaseQty('${item.id}')" aria-label="Increase">&plus;</button>
          </div>
        </div>
        <button class="cart-remove-item" onclick="removeFromCart('${item.id}')" title="Remove Item" aria-label="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');
  }

  window.increaseQty = function(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += 1;
      updateCartUI();
    }
  };

  window.decreaseQty = function(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
        showToast('Item removed from cart', 'info');
      }
      updateCartUI();
    }
  };

  window.removeFromCart = function(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
      cart = cart.filter(i => i.id !== id);
      updateCartUI();
      showToast(`${item.name} removed`, 'info');
    }
  };

  window.addToCart = function(name, price, img) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: 'item-' + Date.now(),
        name: name,
        price: parseFloat(price.replace('$', '')),
        qty: 1,
        img: img
      });
    }
    updateCartUI();
    showToast(`Added ${name} to cart!`, 'success');
  };

  // Cart Drawer open/close
  function openCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCart();
      showToast('Proceeding to Checkout! Please verify delivery address.', 'info');
      setTimeout(() => openOrderModal(), 400);
    });
  }

  // Clickable interactive floating cards
  const orangeCard = document.querySelector('.orange-img');
  if (orangeCard) {
    orangeCard.addEventListener('click', () => {
      window.addToCart('Fresh Organic Oranges (1kg)', '$4.99', './assets/images/orange-card.png');
    });
  }

  const strawberryCard = document.querySelector('.melting-cheese-card');
  if (strawberryCard) {
    strawberryCard.addEventListener('click', () => {
      window.addToCart('Farm Fresh Strawberries (500g)', '$6.50', './assets/images/strawberry.png');
    });
  }

  // ==========================================
  // 4. Live Search Filtering
  // ==========================================
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = searchResults.querySelectorAll('.search-result-item');
      
      if (query.length > 0) {
        let hasMatches = false;
        items.forEach(item => {
          const name = item.getAttribute('data-name').toLowerCase();
          if (name.includes(query)) {
            item.style.display = 'flex';
            hasMatches = true;
          } else {
            item.style.display = 'none';
          }
        });
        
        searchResults.classList.add('active');
        if (!hasMatches) {
          searchResults.innerHTML = `
            <div style="padding: 12px; font-size: 0.9rem; color: #8E8E8E; text-align: center;">
              No fresh items match "<strong>${query}</strong>"
            </div>
          `;
        }
      } else {
        searchResults.classList.remove('active');
      }
    });

    // Handle clicking a search result item
    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item) {
        const name = item.getAttribute('data-name');
        const price = item.getAttribute('data-price');
        const img = item.getAttribute('data-img');
        window.addToCart(name, price, img);
        searchResults.classList.remove('active');
        searchInput.value = '';
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 5. Mobile Drawer Navigation
  // ==========================================
  function toggleMobileNav() {
    const isOpen = hamburger.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
      mobileLinks.forEach(l => l.classList.remove('active-menu'));
      link.classList.add('active-menu');
    });
  });

  // ==========================================
  // 6. Sticky Navbar & Active Section Highlighting
  // ==========================================
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Sticky navbar glass style
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
    
    // Scrollspy active menu
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            navItems.forEach(i => i.classList.remove('active-menu'));
            item.classList.add('active-menu');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 7. Modals (Process & Quick Order)
  // ==========================================
  function openProcessModal() {
    if (processModal) {
      processModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeProcessModal() {
    if (processModal) {
      processModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openProcessModalBtn) openProcessModalBtn.addEventListener('click', openProcessModal);
  if (closeProcessBtn) closeProcessBtn.addEventListener('click', closeProcessModal);
  if (processModal) {
    processModal.addEventListener('click', (e) => {
      if (e.target === processModal) closeProcessModal();
    });
  }

  function openOrderModal() {
    closeProcessModal();
    if (orderModal) {
      orderModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOrderModal() {
    if (orderModal) {
      orderModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openOrderBtns.forEach(btn => btn.addEventListener('click', openOrderModal));
  if (closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeOrderModal);
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  window.handleExpressOrder = function(event) {
    event.preventDefault();
    closeOrderModal();
    showToast('🎉 Your fresh grocery order has been placed! Courier arriving in 2 hours.', 'success', 5000);
    // Reset cart
    cart = [];
    updateCartUI();
  };

  // Newsletter Submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput ? emailInput.value : '';
      if (email) {
        showToast(`🎉 Subscribed! 15% discount code sent to ${email}`, 'success');
        newsletterForm.reset();
      }
    });
  }

  // ==========================================
  // 8. 3D Tilt Effect (VanillaTilt)
  // ==========================================
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.each-card'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });

    VanillaTilt.init(document.querySelectorAll('.orange-img, .melting-cheese-card, .delivery-card'), {
      max: 18,
      speed: 350
    });
  }

  // ==========================================
  // 9. Scroll Animations (GSAP & ScrollTrigger)
  // ==========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    heroTl
      .from('.header-badge', { y: 20, opacity: 0, delay: 0.2 })
      .from('.header-heading', { y: 30, opacity: 0 }, '-=0.6')
      .from('.header-info', { y: 20, opacity: 0 }, '-=0.6')
      .from('.header-btns', { y: 20, opacity: 0 }, '-=0.6')
      .from('#chef-img', { scale: 0.9, opacity: 0, duration: 1.1 }, '-=0.8')
      .from('.orange-img', { y: 40, opacity: 0 }, '-=0.6')
      .from('.alram-img', { y: -40, opacity: 0 }, '-=0.6');

    // Services cards entrance
    gsap.from('.each-card', {
      scrollTrigger: {
        trigger: '#our-services',
        start: 'top 75%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Why Choose Us
    gsap.from('.whysection-hero', {
      scrollTrigger: {
        trigger: '#whyUs',
        start: 'top 75%'
      },
      x: -50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });
    gsap.from('.whyus-content', {
      scrollTrigger: {
        trigger: '#whyUs',
        start: 'top 75%'
      },
      x: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });

    // Delivery Section
    gsap.from('.delivery-content', {
      scrollTrigger: {
        trigger: '#delivery',
        start: 'top 75%'
      },
      x: -50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });
    gsap.from('.delivery-hero', {
      scrollTrigger: {
        trigger: '#delivery',
        start: 'top 75%'
      },
      x: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });

    // App Download Section
    gsap.from('.application-hero', {
      scrollTrigger: {
        trigger: '#application',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });
    gsap.from('.application-content', {
      scrollTrigger: {
        trigger: '#application',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      delay: 0.2,
      ease: 'power2.out'
    });
  }

  // Initial cart UI render
  updateCartUI();
});

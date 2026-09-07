/* Global Mobile Menu Toggle Handler */
window.toggleMobileMenu = (open) => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenuBtn || !mobileMenu) return;

  const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
  const shouldShow = open !== undefined ? Boolean(open) : isCurrentlyHidden;

  if (shouldShow) {
    mobileMenu.classList.remove('hidden');
    mobileMenuBtn.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
  }
};

const initApp = () => {
  // 1. Theme Toggle Management (Light / Dark)
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      updateThemeIcons(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeIcons(false);
    }
  };

  const updateThemeIcons = (isDark) => {
    const themeBtnText = document.querySelectorAll('.theme-btn-text');
    themeBtnText.forEach(el => {
      el.textContent = isDark ? 'Light' : 'Dark';
    });
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    sunIcons.forEach(el => el.classList.toggle('hidden', !isDark));
    moonIcons.forEach(el => el.classList.toggle('hidden', isDark));
  };

  window.toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  };

  // 2. RTL Direction Management (LTR / RTL)
  const initRTL = () => {
    const savedDir = localStorage.getItem('app_dir');
    if (savedDir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      updateRTLBtn(true);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      updateRTLBtn(false);
    }
  };

  const updateRTLBtn = (isRTL) => {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    const arrowIcon = `<svg class="w-3.5 h-3.5 inline-block me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`;
    rtlBtns.forEach(btn => {
      btn.setAttribute('dir', 'ltr');
      btn.innerHTML = isRTL ? `${arrowIcon}LTR` : `${arrowIcon}RTL`;
    });
  };

  window.toggleRTL = () => {
    const currentDir = document.documentElement.getAttribute('dir');
    const isRTL = currentDir === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('app_dir', newDir);
    updateRTLBtn(!isRTL);
  };

  // Initialize Theme and Direction
  initTheme();
  initRTL();

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    if (!mobileMenuBtn.getAttribute('onclick')) {
      mobileMenuBtn.addEventListener('click', () => window.toggleMobileMenu());
    }

    mobileMenu.querySelectorAll('a, button:not(.theme-toggle-btn)').forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.target.closest('button[onclick*="toggle"]')) return;
        window.toggleMobileMenu(false);
      });
    });
  }

  // 4. Dropdown Model Handler (for home2 button drop model & quick select menus)
  window.toggleDropdownModel = (dropdownId) => {
    const menu = document.getElementById(dropdownId);
    if (!menu) return;
    const isHidden = menu.classList.contains('hidden');
    document.querySelectorAll('.dropdown-model-menu').forEach(el => {
      if (el.id !== dropdownId) el.classList.add('hidden');
    });
    if (isHidden) {
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  };

  // Close dropdown models when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-model-container')) {
      document.querySelectorAll('.dropdown-model-menu').forEach(el => el.classList.add('hidden'));
    }
  });

  // 6. Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'dark:bg-blue-600');
        b.classList.add('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      btn.classList.remove('bg-slate-200', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      btn.classList.add('bg-blue-600', 'text-white', 'dark:bg-blue-600');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'All' || itemCat === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. Blog Search Filter
  const blogSearchInput = document.getElementById('blog-search-input');
  const blogCards = document.querySelectorAll('.blog-card');
  if (blogSearchInput && blogCards.length > 0) {
    blogSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      blogCards.forEach(card => {
        const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
        const summary = card.querySelector('.blog-summary')?.textContent.toLowerCase() || '';
        if (title.includes(term) || summary.includes(term)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 7b. Blog Category Filter Function
  const blogCatBtns = document.querySelectorAll('.blog-cat-btn');
  const blogCardsForFilter = document.querySelectorAll('.blog-card');
  if (blogCatBtns.length > 0) {
    blogCatBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = btn.getAttribute('data-category') || 'All';

        blogCatBtns.forEach(b => {
          b.className = 'blog-cat-btn px-5 py-2.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition';
        });
        btn.className = 'blog-cat-btn px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md transition';

        blogCardsForFilter.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'All' || cardCat === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  window.filterBlogCategory = (category = 'All') => {
    const targetBtn = document.querySelector(`.blog-cat-btn[data-category="${category}"]`);
    if (targetBtn) {
      targetBtn.click();
    } else {
      const blogCards = document.querySelectorAll('.blog-card');
      const catBtns = document.querySelectorAll('.blog-cat-btn');

      catBtns.forEach(btn => {
        const catAttr = btn.getAttribute('data-category') || '';
        if (catAttr === category || (category === 'All' && catAttr === 'All')) {
          btn.className = 'blog-cat-btn px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md transition';
        } else {
          btn.className = 'blog-cat-btn px-5 py-2.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition';
        }
      });

      blogCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'All' || cardCat === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  };

  // 8. Quick Booking Popup Modal
  const ensureBookingModalInDOM = () => {
    let modal = document.getElementById('booking-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'booking-modal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-4';
      modal.innerHTML = `
        <div class="card-theme max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl relative shadow-2xl border border-slate-700">
          <button onclick="closeBookingModal()" aria-label="Close Modal" class="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center cursor-pointer shadow-sm z-20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Book Service Inspection</h3>
          <p class="text-xs text-slate-500 mb-6">Select your service date and contact details for instant confirmation.</p>

          <form id="modal-booking-form" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" required placeholder="John Doe" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input type="tel" required placeholder="(555) 000-0000" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" required placeholder="john@example.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service Type</label>
              <select id="modal-service-select" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none">
                <option value="Chimney Deep Cleaning">Chimney Deep Cleaning ($149)</option>
                <option value="Commercial Hood & Duct Cleaning">Commercial Hood & Duct Cleaning ($299)</option>
                <option value="Filter Replacement & Degreasing">Filter Replacement & Degreasing ($79)</option>
                <option value="Electrostatic Precipitator (ESP) Servicing">Electrostatic Precipitator (ESP) Servicing ($349)</option>
                <option value="NFPA 96 Safety Inspection">NFPA 96 Safety Inspection ($129)</option>
              </select>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                <input type="date" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                <select class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none">
                  <option>Morning (8am - 12pm)</option>
                  <option>Afternoon (12pm - 4pm)</option>
                  <option>Overnight Off-Hours (Commercial)</option>
                </select>
              </div>
            </div>
            <button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition cursor-pointer">Confirm Service Request</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      const dynamicForm = modal.querySelector('#modal-booking-form');
      if (dynamicForm) {
        dynamicForm.addEventListener('submit', (e) => {
          e.preventDefault();
          showToast('Thank you! Your booking request has been submitted successfully.');
          closeBookingModal();
          dynamicForm.reset();
        });
      }
    }
    return modal;
  };

  window.openBookingModal = (serviceName = '') => {
    const modal = ensureBookingModalInDOM();
    const serviceSelect = document.getElementById('modal-service-select');
    if (serviceSelect && serviceName) {
      let matched = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase()) || 
            serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched && serviceName) {
        const opt = new Option(serviceName + ' (Selected)', serviceName, true, true);
        serviceSelect.add(opt);
      }
    }
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closeBookingModal = () => {
    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // 9. Toast Notification Trigger
  window.showToast = (message = 'Operation successful!') => {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-300';
      toast.innerHTML = `
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span id="toast-message" class="font-medium mr-2">${message}</span>
        <button onclick="this.parentElement.classList.remove('show')" aria-label="Close Toast" class="ml-auto opacity-70 hover:opacity-100 transition p-1 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      `;
      document.body.appendChild(toast);
    } else {
      document.getElementById('toast-message').textContent = message;
    }

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => toast.classList.remove('show'), 4000);
  };

  // 10. Booking and Contact Form Handling
  const bookingForms = document.querySelectorAll('.booking-form, #contact-form, #modal-booking-form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your booking request has been submitted successfully.');
      closeBookingModal();
      form.reset();
    });
  });

  // 11. Dynamic Live Price & Service Estimator Widget
  window.calculatePriceEstimate = () => {
    const facilityType = document.getElementById('calc-facility-type')?.value || 'commercial';
    const hoodLength = parseInt(document.getElementById('calc-hood-length')?.value || '10');
    const ductLength = parseInt(document.getElementById('calc-duct-length')?.value || '15');
    const isOvernight = document.getElementById('calc-overnight')?.checked || false;
    const isEspFilter = document.getElementById('calc-esp')?.checked || false;

    // Base calculation logic
    let basePrice = facilityType === 'residential' ? 99 : 249;
    let hoodCost = (hoodLength > 6) ? (hoodLength - 6) * 18 : 0;
    let ductCost = (ductLength > 10) ? (ductLength - 10) * 12 : 0;
    let overnightFee = isOvernight ? 75 : 0;
    let espFee = isEspFilter ? 85 : 0;

    let total = basePrice + hoodCost + ductCost + overnightFee + espFee;
    let durationHours = Math.round((2 + (hoodLength * 0.15) + (ductLength * 0.1)) * 10) / 10;

    const displayTotal = document.getElementById('calc-total-price');
    const displayDuration = document.getElementById('calc-duration');
    const displayHoodLength = document.getElementById('calc-hood-length-val');
    const displayDuctLength = document.getElementById('calc-duct-length-val');

    if (displayTotal) displayTotal.textContent = '$' + total;
    if (displayDuration) displayDuration.textContent = durationHours + ' hrs';
    if (displayHoodLength) displayHoodLength.textContent = hoodLength + ' ft';
    if (displayDuctLength) displayDuctLength.textContent = ductLength + ' ft';
  };

  // Trigger initial calculation if elements exist
  if (document.getElementById('calc-hood-length')) {
    calculatePriceEstimate();
  }

  // 12. Image Lightbox Modal
  window.closeLightbox = () => {
    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox) {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    }
  };

  window.openLightbox = (imgSrc, titleText = 'Project View') => {
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.className = 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md hidden items-center justify-center p-4 cursor-pointer';
      lightbox.innerHTML = `
        <div class="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-2 cursor-default" onclick="event.stopPropagation()">
          <button onclick="closeLightbox()" aria-label="Close Lightbox" class="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-black text-xl shadow-lg transition transform hover:scale-110 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img id="lightbox-img" src="" alt="Full view" class="w-full max-h-[75vh] object-contain rounded-2xl" />
          <div class="p-4 text-center">
            <h4 id="lightbox-title" class="text-lg font-bold text-white"></h4>
            <p class="text-xs text-orange-400 font-semibold mt-1">100% NFPA 96 Verified Inspection Standard</p>
          </div>
        </div>
      `;
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      document.body.appendChild(lightbox);
    }
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-title').textContent = titleText;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
  };

  // Close lightbox or modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      if (typeof closeBookingModal === 'function') closeBookingModal();
    }
  });

  // 13. FAQ Collapsible Accordion Toggle
  window.toggleFAQ = (faqId) => {
    const answer = document.getElementById(faqId);
    const icon = document.getElementById(faqId + '-icon');
    if (!answer) return;

    const isHidden = answer.classList.contains('hidden');

    // Optional: Close other FAQs for clean single-accordion feel
    document.querySelectorAll('.faq-answer').forEach(el => {
      if (el.id !== faqId) {
        el.classList.add('hidden');
      }
    });
    document.querySelectorAll('.faq-icon').forEach(el => {
      if (el.id !== faqId + '-icon') {
        el.style.transform = 'rotate(0deg)';
      }
    });

    if (isHidden) {
      answer.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      answer.classList.add('hidden');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };

  // 14. Social Media Links Click Toast Handler
  const socialLinks = document.querySelectorAll('a[aria-label="Instagram"], a[aria-label="Facebook"], a[aria-label="LinkedIn"], a[aria-label="X (Twitter)"]');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const platform = link.getAttribute('aria-label') || 'Social Media';
      showToast(`Opening ProClean official ${platform} page...`);
    });
  });

  // 15. Dynamic Service Details Page Resolver
  const initServiceDetailsPage = () => {
    const titleEl = document.getElementById('sd-hero-title');
    if (!titleEl) return;

    const params = new URLSearchParams(window.location.search);
    const serviceKey = (params.get('service') || 'chimney').toLowerCase();

    const servicesData = {
      'chimney': {
        title: 'Chimney Deep Cleaning & Flue Sanitization',
        tag: 'Deep Cleaning Specification',
        desc: 'Complete motorized rotary wire brushing, HEPA soot containment, food-grade chemical degreasing, and dual-lens scope inspection.',
        price: '$149',
        time: 'Takes approx 60-90 minutes',
        img: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Accumulated cooking oils, creosote, and carbonized soot inside home chimneys pose severe indoor air pollution and persistent fire hazards. Standard surface wiping leaves interior duct walls lined with sticky, highly flammable sludge.',
        overview2: 'Our certified technicians utilize industrial motorized rotary wire brushes and food-grade chemical foam to scrub every interior flue inch down to pristine metal. All dislodged particles are captured instantly by HEPA sealed negative-air vacuum units, ensuring your kitchen remains 100% spotless.',
        benefits: [
          { title: '100% Smoke Elimination', desc: 'Stops smoke from spilling back into cooking areas.' },
          { title: 'Zero Oil Dripping', desc: 'Prevents yellow grease drops on stovetops & pans.' },
          { title: '45% Suction Power Boost', desc: 'Restores fan turbine motor efficiency.' },
          { title: 'Odor Removal', desc: 'Eliminates burnt oil & pungent garlic smells.' }
        ],
        faq1: { q: 'How long does a deep chimney cleaning session take?', a: 'A standard residential deep clean takes between 60 and 90 minutes.' },
        faq2: { q: 'Will there be soot mess in my kitchen?', a: 'No. HEPA suction containment units prevent any airborne dust from escaping into your house.' }
      },
      'exhaust-duct': {
        title: 'Commercial Kitchen Exhaust Duct Cleaning',
        tag: 'NFPA 96 Certified',
        desc: 'Bare-metal hand scraping, 3000 PSI hot thermal jet pressure washing, and rooftop fan housing degreasing for commercial facilities.',
        price: '$299',
        time: 'Takes approx 2-3 hours',
        img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Commercial kitchen exhaust systems accumulate dangerous layers of grease across ductwork, fan blades, and hoods. Without routine deep cleaning, grease buildup becomes a catastrophic fire hazard that violates local fire safety codes.',
        overview2: 'Our NFPA 96 certified process cleans the entire system from hood to roof fan. Using high-pressure hot water washing, eco-friendly degreasers, and scraper techniques, we restore duct interiors to bare metal and provide full audit documentation.',
        benefits: [
          { title: 'NFPA 96 Compliance', desc: 'Meets all local fire department and health safety standards.' },
          { title: 'Fire Risk Reduction', desc: 'Removes highly flammable grease deposits throughout entire duct runs.' },
          { title: 'Improved Air Flow', desc: 'Maximizes kitchen ventilation and heat extraction performance.' },
          { title: 'Certified Documentation', desc: 'Includes before & after photo reports for insurance audits.' }
        ],
        faq1: { q: 'How often should commercial exhaust ducts be cleaned?', a: 'NFPA 96 mandates quarterly cleaning for high-volume commercial kitchens, and semi-annually for standard operations.' },
        faq2: { q: 'Do you provide fire compliance certificates?', a: 'Yes! We issue NFPA 96 compliance stickers and digital reports immediately after service.' }
      },
      'filter-replacement': {
        title: 'Baffle Filter Replacement & Ultrasonic Degreasing',
        tag: 'Eco-Chemical Wash',
        desc: 'Ultrasonic dip-tank filter soaking, heavy-duty stainless steel baffle filter fabrication, and activated charcoal odor upgrades.',
        price: '$79',
        time: 'Takes approx 45-60 minutes',
        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Grease baffle filters are your hood\'s first line of defense. Blocked or saturated filters restrict airflow, overheat exhaust motors, and allow heavy grease vapor deeper into your ventilation duct system.',
        overview2: 'We offer professional ultrasonic tank soaking and heavy-duty stainless baffle filter replacement. Our multi-stage degreasing process dissolves baked-on grease layers without damaging stainless steel structures.',
        benefits: [
          { title: 'Restored Air Circulation', desc: 'Allows grease-laden air to pass efficiently into filter traps.' },
          { title: 'Heavy Stainless Grade', desc: 'Durable UL-listed baffle filters resistant to high temperature flame flare-ups.' },
          { title: 'Ultrasonic Deep Soak', desc: 'Reaches hidden inner chambers where manual scrubbing cannot reach.' },
          { title: 'Extended Motor Life', desc: 'Reduces backpressure strain on main exhaust roof fans.' }
        ],
        faq1: { q: 'How often should hood filters be degreased or replaced?', a: 'Filters should be degreased weekly and deep cleaned or swapped every 3-6 months based on cooking volume.' },
        faq2: { q: 'Are replacement filters stainless steel or aluminum?', a: 'We use premium heavy-gauge 430 stainless steel baffle filters rated for extreme commercial heat.' }
      },
      'esp-unit': {
        title: 'Electrostatic Precipitator (ESP) Unit Servicing',
        tag: 'Commercial Filtration',
        desc: 'High-voltage ionizer cell chemical bath soaking, spark diagnostics, insulator testing, and UV-C air purifier tube replacement.',
        price: '$349',
        time: 'Takes approx 90-120 minutes',
        img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Electrostatic Precipitators (ESP) filter high-density smoke, fine grease mist, and odor particles before air is discharged. Saturated ionizer cells lose charge efficiency and trigger automatic safety shutdowns.',
        overview2: 'Our technicians perform deep cell washing, ionizer wire alignment, insulator cleaning, and voltage power module testing to ensure maximum smoke suppression and compliance with environmental emissions regulations.',
        benefits: [
          { title: '99.8% Smoke & Mist Removal', desc: 'Keeps neighborhood discharge clean and free of heavy smoke.' },
          { title: 'Cell Voltage Optimization', desc: 'Restores high-voltage ionizing performance for peak capture efficiency.' },
          { title: 'Odor Control Integration', desc: 'Ensures secondary carbon filters operate in clean air streams.' },
          { title: 'Preventive Care', desc: 'Prevents electrical short-circuits and expensive cell replacement.' }
        ],
        faq1: { q: 'What happens if ESP cells are not cleaned regularly?', a: 'Grease buildup causes short-circuit arcing, power module failure, and total loss of smoke filtration capability.' },
        faq2: { q: 'Do you service all commercial ESP brands?', a: 'Yes, we service Trion, Smog-Hog, Air Quality Engineering, and all major commercial ESP units.' }
      },
      'commercial-hood': {
        title: 'Commercial Canopy Hood Washing & Polish',
        tag: 'Restaurant & Hotel',
        desc: 'Overhead canopy hood degreasing, mirror stainless steel polishing, grease trough clearing, and drip tray seal replacement.',
        price: '$199',
        time: 'Takes approx 1-2 hours',
        img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Canopy hoods trap grease directly above hot cooking surfaces. Over time, dripping grease and charred carbon create unhygienic conditions and severe fire vulnerabilities right over open flames.',
        overview2: 'We degrease, scrape, and polish inner and outer hood surfaces, gutters, and grease cups to a mirror shine using non-corrosive, food-grade cleaning agents that preserve stainless steel brilliance.',
        benefits: [
          { title: 'Spotless Mirror Finish', desc: 'Enhances commercial kitchen aesthetic for open kitchen layouts.' },
          { title: 'Hygienic Cooking Zone', desc: 'Prevents grease drops into prepared dishes and fryers.' },
          { title: 'Grease Cup Maintenance', desc: 'Clears drip trays and drains to prevent overflow spillages.' },
          { title: 'Health Inspection Ready', desc: 'Meets strict food service sanitation standards.' }
        ],
        faq1: { q: 'Will hood washing leave chemical residue on kitchen equipment?', a: 'No, we use NSF-certified food-grade degreasers followed by steam rinsing and food-safe stainless polishing.' },
        faq2: { q: 'Can hood washing be done overnight?', a: 'Yes! We offer 24/7 overnight scheduling to minimize disruption to your normal restaurant operating hours.' }
      },
      'nfpa-inspection': {
        title: 'NFPA 96 Compliance & Scope Inspection',
        tag: 'Audit & Certification',
        desc: 'Full ventilation fire safety audit, access panel check, dual-lens camera scope video logging, and official NFPA 96 certificate.',
        price: '$129',
        time: 'Takes approx 45-60 minutes',
        img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Regular inspections are required by law for commercial kitchens under NFPA 96 standard. Detailed visual and video scope reports verify system integrity and prevent unexpected shutdown orders.',
        overview2: 'We conduct end-to-end inspections using digital scope cameras, measure grease accumulation levels, issue official NFPA compliance certificates, and log digital inspection records for fire marshals.',
        benefits: [
          { title: 'Official Certification', desc: 'Valid Certificate of Inspection for Fire Marshal & Insurance.' },
          { title: 'Digital Video Scope', desc: 'High-definition photo/video evidence of entire hidden duct run.' },
          { title: 'Combustion Risk Assessment', desc: 'Identifies hidden grease pockets before they ignite.' },
          { title: 'Audit Protection', desc: 'Keeps your facility fully compliant with local safety codes.' }
        ],
        faq1: { q: 'Is NFPA 96 inspection required for insurance coverage?', a: 'Yes. Most commercial property insurance policies require documented NFPA 96 inspection proof to honor claims.' },
        faq2: { q: 'How fast do we receive the compliance certificate?', a: 'Certificates and digital video scope logs are delivered electronically within 24 hours of inspection.' }
      },
      'rooftop-fan': {
        title: 'Rooftop Exhaust Fan Repair & Maintenance',
        tag: 'Mechanical Servicing',
        desc: 'Fan blade degreasing, belt tension adjustment, motor bearing lubrication, hinge kit inspection, and roof grease containment.',
        price: '$179',
        time: 'Takes approx 60-90 minutes',
        img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
        overview1: 'Rooftop exhaust fans operate under extreme conditions, drawing heat, moisture, and grease out of the facility. Unbalanced fan blades, worn belts, or grease accumulation cause motor failure and roof damage.',
        overview2: 'Our service includes fan blade degreasing, belt tension adjustment, motor bearing lubrication, hinge kit inspection, and containment pillow replacement to protect roof membranes from grease damage.',
        benefits: [
          { title: 'Roof Membrane Protection', desc: 'Prevents acidic grease from eating through roofing materials.' },
          { title: 'Vibration Reduction', desc: 'Balances fan impellers to reduce noise and mechanical wear.' },
          { title: 'Belt & Bearing Service', desc: 'Extends fan motor lifespan and prevents sudden breakdowns.' },
          { title: 'Optimal Air Extraction', desc: 'Sustained static pressure for full ventilation capability.' }
        ],
        faq1: { q: 'Why is roof fan hinge kit installation important?', a: 'Hinge kits allow roof fans to be tilted safely during duct cleaning without damaging electrical lines or seals.' },
        faq2: { q: 'Do you replace grease containment absorbent pads?', a: 'Yes, we supply and replace heavy-duty grease catchment pillows on every rooftop inspection.' }
      }
    };

    const aliases = {
      'chimney-deep-cleaning': 'chimney',
      'exhaust-duct-cleaning': 'exhaust-duct',
      'filter-replacement-degreasing': 'filter-replacement',
      'esp-precipitator': 'esp-unit',
      'esp-servicing': 'esp-unit',
      'commercial-hood-washing': 'commercial-hood',
      'commercial-hood-cleaning': 'commercial-hood',
      'nfpa-safety-inspection': 'nfpa-inspection',
      'fire-safety': 'nfpa-inspection',
      'rooftop-exhaust-fan': 'rooftop-fan'
    };

    const resolvedKey = aliases[serviceKey] || serviceKey;
    const data = servicesData[resolvedKey] || servicesData['chimney'];

    document.title = `${data.title} - Service Details | ProClean`;

    titleEl.textContent = data.title;
    const tagEl = document.getElementById('sd-hero-tag');
    if (tagEl) tagEl.textContent = data.tag;

    const descEl = document.getElementById('sd-hero-desc');
    if (descEl) descEl.textContent = data.desc;

    const priceEl = document.getElementById('sd-hero-price');
    if (priceEl) priceEl.textContent = data.price;

    const timeEl = document.getElementById('sd-hero-time');
    if (timeEl) timeEl.textContent = data.time;

    const imgEl = document.getElementById('sd-main-img');
    if (imgEl) {
      imgEl.src = data.img;
      imgEl.alt = data.title;
    }

    const p1El = document.getElementById('sd-overview-p1');
    if (p1El) p1El.textContent = data.overview1;

    const p2El = document.getElementById('sd-overview-p2');
    if (p2El) p2El.textContent = data.overview2;

    if (data.benefits && data.benefits.length >= 4) {
      const b1t = document.getElementById('sd-b1-t');
      const b1d = document.getElementById('sd-b1-d');
      if (b1t && b1d) { b1t.textContent = data.benefits[0].title; b1d.textContent = data.benefits[0].desc; }

      const b2t = document.getElementById('sd-b2-t');
      const b2d = document.getElementById('sd-b2-d');
      if (b2t && b2d) { b2t.textContent = data.benefits[1].title; b2d.textContent = data.benefits[1].desc; }

      const b3t = document.getElementById('sd-b3-t');
      const b3d = document.getElementById('sd-b3-d');
      if (b3t && b3d) { b3t.textContent = data.benefits[2].title; b3d.textContent = data.benefits[2].desc; }

      const b4t = document.getElementById('sd-b4-t');
      const b4d = document.getElementById('sd-b4-d');
      if (b4t && b4d) { b4t.textContent = data.benefits[3].title; b4d.textContent = data.benefits[3].desc; }
    }

    if (data.faq1) {
      const faq1Elem = document.getElementById('sd-faq-1');
      if (faq1Elem) {
        const btnSpan = faq1Elem.previousElementSibling?.querySelector('span');
        if (btnSpan) btnSpan.textContent = data.faq1.q;
        faq1Elem.textContent = data.faq1.a;
      }
    }
    if (data.faq2) {
      const faq2Elem = document.getElementById('sd-faq-2');
      if (faq2Elem) {
        const btnSpan = faq2Elem.previousElementSibling?.querySelector('span');
        if (btnSpan) btnSpan.textContent = data.faq2.q;
        faq2Elem.textContent = data.faq2.a;
      }
    }

    document.querySelectorAll('.sd-book-trigger').forEach(btn => {
      btn.setAttribute('onclick', `openBookingModal('${data.title.replace(/'/g, "\\'")}')`);
    });
  };

  initServiceDetailsPage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}





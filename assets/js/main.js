/* Global Mobile Menu Toggle Handler */
window.toggleMobileMenu = (open) => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = mobileMenuBtn ? mobileMenuBtn.closest('header') : document.querySelector('header');
  if (!mobileMenuBtn || !mobileMenu) return;

  const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
  const shouldShow = open !== undefined ? Boolean(open) : isCurrentlyHidden;

  if (shouldShow) {
    mobileMenu.classList.remove('hidden');
    if (header) header.classList.add('mobile-menu-open');
    document.body.classList.add('mobile-menu-active');
    document.documentElement.classList.add('mobile-menu-active');
    mobileMenu.scrollTop = 0;
    mobileMenuBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else {
    mobileMenu.classList.add('hidden');
    if (header) header.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-menu-active');
    document.documentElement.classList.remove('mobile-menu-active');
    mobileMenuBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
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
      el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
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
    rtlBtns.forEach(btn => {
      btn.setAttribute('dir', 'ltr');
      if (btn.classList.contains('rtl-toggle-pill')) {
        btn.innerHTML = isRTL
          ? '<span class="rtl-text-ltr text-slate-500 dark:text-slate-400">LTR</span><span class="mx-1.5 text-slate-400 font-normal">⇄</span><span class="rtl-text-rtl text-amber-500 dark:text-amber-400 font-extrabold">RTL</span>'
          : '<span class="rtl-text-ltr text-amber-500 dark:text-amber-400 font-extrabold">LTR</span><span class="mx-1.5 text-slate-400 font-normal">⇄</span><span class="rtl-text-rtl text-slate-500 dark:text-slate-400">RTL</span>';
      } else {
        btn.textContent = isRTL ? 'LTR' : 'RTL';
      }
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

    mobileMenu.querySelectorAll('a, button:not([onclick*="toggleTheme"]):not([onclick*="toggleRTL"])').forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.target.closest('button[onclick*="toggle"]')) return;
        window.toggleMobileMenu(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        window.toggleMobileMenu(false);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.toggleMobileMenu(false);
      }
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

  // 5. Sticky Header Scroll Monitor ("Standing" header elevation)
  const header = document.querySelector('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        header.classList.add('scrolled', 'shadow-md');
      } else {
        header.classList.remove('scrolled', 'shadow-md');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

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
        const itemCat = item.getAttribute('data-category') || '';
        if (category === 'All' || itemCat.includes(category)) {
          item.style.display = 'flex';
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
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-4';
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
              <input type="text" required minlength="2" pattern="^[A-Za-z\s]{2,50}$" title="Please enter only alphabets (letters and spaces only)" placeholder="John Doe" oninput="this.value = this.value.replace(/[^A-Za-z\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input type="tel" required pattern="^[0-9\-\+\(\)\s]{7,20}$" title="Please enter a valid phone number (digits, spaces, hyphens, and + only)" placeholder="(555) 000-0000" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address (e.g. name@domain.com)" placeholder="john@example.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
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
          const textInputs = dynamicForm.querySelectorAll('input[type="text"]');
          for (const input of textInputs) {
            const val = input.value.trim();
            if (val.length < 2) {
              showToast('Please enter a valid full name (at least 2 characters).');
              input.focus();
              return;
            }
            const isNameField = input.placeholder === 'John Doe' || (input.previousElementSibling && /Name/i.test(input.previousElementSibling.textContent));
            if (isNameField && !/^[A-Za-z\s]{2,50}$/.test(val)) {
              showToast('Please enter only alphabets for Full Name.');
              input.focus();
              return;
            }
          }
          const phoneRegex = /^[0-9\-\+\(\)\s]{7,20}$/;
          const telInputs = dynamicForm.querySelectorAll('input[type="tel"]');
          for (const input of telInputs) {
            const val = input.value.trim();
            const digitCount = val.replace(/\D/g, '').length;
            if (!phoneRegex.test(val) || digitCount < 7) {
              showToast('Please enter a valid phone number (digits only, at least 7 digits).');
              input.focus();
              return;
            }
          }
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const emailInputs = dynamicForm.querySelectorAll('input[type="email"]');
          for (const input of emailInputs) {
            const val = input.value.trim();
            if (!emailRegex.test(val)) {
              showToast('Please enter a valid email address (e.g. name@domain.com).');
              input.focus();
              return;
            }
          }
          showToast('Thank you! Your booking request has been submitted successfully.');
          closeBookingModal();
          dynamicForm.reset();
        });
      }
    }
    return modal;
  };

  window.openBookingModal = (serviceName = '') => {
    window.toggleMobileMenu(false);
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

  // Forgot Password Handler with mandatory email validation
  window.handleForgotPassword = (event, btn) => {
    if (event) event.preventDefault();
    const form = btn ? btn.closest('form') : document.querySelector('form');
    const emailInput = form ? form.querySelector('input[type="email"]') : document.querySelector('input[type="email"]');
    
    if (!emailInput) return false;
    
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailVal || !emailRegex.test(emailVal)) {
      showToast('Please enter a valid email address first to reset your password.');
      emailInput.focus();
      return false;
    }
    
    showToast(`Password reset link sent to ${emailVal}.`);
    return false;
  };

  // 10. Booking and Contact Form Handling
  document.addEventListener('input', (e) => {
    if (e.target && e.target.matches('input[type="tel"]')) {
      e.target.value = e.target.value.replace(/[^0-9\-\+\(\)\s]/g, '');
    }
    if (e.target && (e.target.placeholder === 'John Doe' || (e.target.previousElementSibling && /Name/i.test(e.target.previousElementSibling.textContent)))) {
      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    }
  });

  const bookingForms = document.querySelectorAll('.booking-form:not(#login-form), #contact-form, #modal-booking-form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const textInputs = form.querySelectorAll('input[type="text"]');
      for (const input of textInputs) {
        const val = input.value.trim();
        if (val.length < 2) {
          showToast('Please enter a valid full name (at least 2 characters).');
          input.focus();
          return;
        }
        const isNameField = input.placeholder === 'John Doe' || (input.previousElementSibling && /Name/i.test(input.previousElementSibling.textContent));
        if (isNameField && !/^[A-Za-z\s]{2,50}$/.test(val)) {
          showToast('Please enter only alphabets for Full Name.');
          input.focus();
          return;
        }
      }
      const phoneRegex = /^[0-9\-\+\(\)\s]{7,20}$/;
      const telInputs = form.querySelectorAll('input[type="tel"]');
      for (const input of telInputs) {
        const val = input.value.trim();
        const digitCount = val.replace(/\D/g, '').length;
        if (!phoneRegex.test(val) || digitCount < 7) {
          showToast('Please enter a valid phone number (digits only, at least 7 digits).');
          input.focus();
          return;
        }
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const emailInputs = form.querySelectorAll('input[type="email"]');
      for (const input of emailInputs) {
        const val = input.value.trim();
        if (!emailRegex.test(val)) {
          showToast('Please enter a valid email address (e.g. name@domain.com).');
          input.focus();
          return;
        }
      }
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
        img: 'assets/images/chimney-deep-cleaning.jpg',
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
        img: 'assets/images/exhaust-duct-cleaning.png',
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
        img: 'assets/images/home-filter-replacement-degreasing.png',
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
        img: 'assets/images/home2-esp-unit.jpg',
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
        img: 'assets/images/commercial-hood-washing.png',
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
        img: 'assets/images/bare-metal-cleaning-excellence.png',
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
        img: 'assets/images/gallery-rooftop-fan.jpg',
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
      },
      'auto-clean': {
        title: 'Auto-Clean Chimney Repair & Service',
        tag: 'Diagnostic & Thermal Repair',
        desc: 'Diagnostic and repair for auto-clean heating elements, motor capacitor replacements, touch sensor repairs, and unblocking oil collectors.',
        price: '$129',
        time: 'Takes approx 45-60 minutes',
        img: 'assets/images/auto-clean-chimney-repair.png',
        overview1: 'Auto-clean kitchen chimneys rely on internal heating elements or water flushing mechanisms to melt and channel sticky grease into a collection tray. When the heating coil, thermostat, or PCB board malfunctions, grease solidifies inside the motor casing, drastically reducing suction and risking motor burnout.',
        overview2: 'Our technicians specialize in diagnosing and repairing all auto-clean brands. We test thermal heating circuits, replace faulty motor capacitors, repair responsive touch & motion sensor controls, and thoroughly flush clogged oil drainage channels.',
        benefits: [
          { title: 'Thermal Coil Diagnostics', desc: 'Precise multimeter testing and replacement of auto-clean heating elements.' },
          { title: 'Touch & Gesture Sensors', desc: 'Fixes unresponsive capacitive touch switches and motion control sensors.' },
          { title: 'Motor & Capacitor Check', desc: 'Eliminates humming noises, slow rotation, and power capacitor failures.' },
          { title: 'Oil Collector Channel Flush', desc: 'Unblocks internal grease drainage tubes and collector cups.' }
        ],
        faq1: { q: 'Why is my chimney auto-clean feature not collecting oil?', a: 'This is commonly caused by a burnt-out heating coil, a tripped thermostat fuse, or solidified grease choking the oil collector drain pipe.' },
        faq2: { q: 'Do you service all auto-clean chimney brands?', a: 'Yes, we service Faber, Glen, Elica, Hindware, Kaff, Bosch, and all major auto-clean chimney models.' }
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
      'rooftop-exhaust-fan': 'rooftop-fan',
      'auto-clean-repair': 'auto-clean',
      'auto-clean-chimney': 'auto-clean',
      'auto-clean-servicing': 'auto-clean'
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

    const home2Images = {
      'commercial-hood': 'assets/images/home2-commercial-canopy-hood-washing.png',
      'exhaust-duct': 'assets/images/home2-exhaust-duct-jetting.jpg',
      'rooftop-fan': 'assets/images/home2-rooftop-exhaust-fan-maintenance.jpg',
      'esp-unit': 'assets/images/home2-esp-unit.jpg',
      'filter-replacement': 'assets/images/home2-baffle-filter-replacement-soak.png',
      'nfpa-inspection': 'assets/images/home2-fire-safety-inspection.jpg'
    };

    const fromSource = params.get('from');
    const customImg = params.get('img');

    let resolvedImg = data.img;
    if (customImg) {
      resolvedImg = customImg;
    } else if (fromSource === 'home2' && home2Images[resolvedKey]) {
      resolvedImg = home2Images[resolvedKey];
    }

    const imgEl = document.getElementById('sd-main-img');
    if (imgEl) {
      imgEl.src = resolvedImg;
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

  const initBlogDetailsPage = () => {
    const titleEl = document.getElementById('bd-title');
    if (!titleEl) return;

    const params = new URLSearchParams(window.location.search);
    const postKey = (params.get('post') || params.get('article') || 'esp-precipitator').toLowerCase();

    const blogArticlesData = {
      'esp-precipitator': {
        title: 'How Electrostatic Precipitators (ESP) Cut Kitchen Odor & Grease Smoke by 99.8%',
        tag: 'Commercial ESP Tech • March 2026 • 8 min read',
        author: 'David Chen',
        role: 'Duct & ESP Specialist',
        initials: 'DC',
        avatarBg: 'bg-emerald-600',
        img: 'assets/images/blog-esp-precipitator.jpg',
        bio: 'David Chen has engineered and serviced high-performance electrostatic precipitation systems for over 12 years across commercial hotel chains and restaurants.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            Electrostatic Precipitator (ESP) air filtration systems have revolutionized commercial exhaust systems for restaurants, hotels, and industrial kitchens by trapping microscopic sub-micron grease smoke particles before they discharge into urban neighborhoods.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">How Two-Stage ESP Ionization Works</h2>
          <p>
            An industrial kitchen ESP operates using a two-stage electrostatic precipitation process. Air drawn from cooking hoods passes first through a high-voltage ionization section (typically 12kV to 14kV DC) where ionizing wires impart an intense positive electrostatic charge to oil droplets, grease vapor, and smoke particulates.
          </p>
          <p>
            Next, the charged airflow enters the collector section composed of closely spaced parallel aluminum plates with alternating high voltage (6kV to 7kV) and ground charges. Positively charged grease particles are forcefully repelled by the high-voltage plates and drawn to the grounded plates, where they condense and drain into collector trays.
          </p>
          <div class="p-6 rounded-2xl bg-orange-500/10 border-l-4 border-orange-500 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200 font-semibold italic">
            "High-efficiency two-stage ESP units achieve up to 99.8% capture efficiency for sub-micron particulate matter, eliminating neighborhood smoke violations."
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">Essential Maintenance & Chemical Cell Soaking</h2>
          <p>
            When grease accumulates on collector plates, electrical resistance increases, leading to spark arcing, voltage drops, and automatic safety tripping. Bi-weekly or monthly ultrasonic chemical tank soaking is critical to strip baked-on grease layers without damaging ceramic insulators or bending delicate ionizer wires.
          </p>
        `
      },
      'nfpa-96': {
        title: 'NFPA 96 Standards: What Every Restaurant Owner Must Know',
        tag: 'Regulations & Codes • August 28, 2026 • 6 min read',
        author: 'Capt. Marcus Vance',
        role: 'Certified Master Fire Inspector',
        initials: 'MV',
        avatarBg: 'bg-blue-600',
        img: 'assets/images/blog-nfpa96-standards.jpg',
        bio: 'Capt. Marcus Vance has inspected over 3,000 commercial kitchen exhaust systems across his 18-year career as a certified fire safety official.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            Commercial kitchen fires cause millions of dollars in structural damage every year. The vast majority originate on cooking appliances and rapidly spread up into the exhaust canopy and vertical ductwork lined with flammable grease buildup.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">What is NFPA 96?</h2>
          <p>
            NFPA 96 is the National Fire Protection Association standard for ventilation control and fire protection of commercial cooking operations. It dictates precise mandatory cleaning schedules based on cooking volume and fuel type:
          </p>
          <ul class="list-disc pl-6 space-y-2 rtl:pr-6 rtl:pl-0">
            <li><strong>Monthly:</strong> Systems serving solid fuel cooking operations (charcoal, wood fires, wok ranges).</li>
            <li><strong>Quarterly:</strong> High-volume cooking operations such as 24-hour diners, burger joints, and hotel kitchens.</li>
            <li><strong>Semi-Annually:</strong> Moderate-volume cooking operations (standard sit-down restaurants).</li>
            <li><strong>Annually:</strong> Low-volume cooking operations such as churches, seasonal venues, and day camps.</li>
          </ul>
          <div class="p-6 rounded-2xl bg-orange-500/10 border-l-4 border-orange-500 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200 font-semibold italic">
            "Failing a municipal fire inspector audit due to hidden duct grease is an easily preventable disaster that can void your insurance policy."
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">Why Bare-Metal Cleaning Matters</h2>
          <p>
            Superficial wiping of visible stainless steel hood surfaces is not enough. NFPA 96 section 11.6 explicitly mandates that the entire exhaust system—from the hood filters, through horizontal and vertical duct risers, up to the rooftop fan—must be cleaned to bare metal.
          </p>
        `
      },
      'warning-signs': {
        title: 'Warning Signs Your Kitchen Chimney Needs Urgent Deep Clean',
        tag: 'Home Chimney Care • Feb 22, 2026 • 4 min read',
        author: 'Sarah Jenkins',
        role: 'Residential Chimney Specialist',
        initials: 'SJ',
        avatarBg: 'bg-orange-600',
        img: 'assets/images/blog-chimney-warning-signs.jpg',
        bio: 'Sarah Jenkins specializes in residential chimney care, airflow diagnostics, and home fire prevention.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            A malfunctioning or grease-choked kitchen chimney is not just an annoying source of haze—it is a severe indoor air pollutant and persistent kitchen fire hazard.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">Critical Warning Signs to Watch For</h2>
          <p>
            Watch for these unmistakable symptoms indicating your chimney flue and blower turbine require immediate motorized scrub servicing:
          </p>
          <ul class="list-disc pl-6 space-y-2 rtl:pr-6 rtl:pl-0">
            <li><strong>Smoke Backdraft:</strong> Cooking vapors hover around cabinets and linger instead of exhausting outward.</li>
            <li><strong>Yellow Oil Dripping:</strong> Condensed grease leaks from the outer hood rim or light fixtures down onto stovetops.</li>
            <li><strong>Excessive Motor Vibration:</strong> Heavy carbonized grease on blower impellers throws the motor off balance.</li>
            <li><strong>Persistent Pungent Odor:</strong> Burnt oil smell remains even 12 hours after cooking has finished.</li>
          </ul>
          <div class="p-6 rounded-2xl bg-orange-500/10 border-l-4 border-orange-500 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200 font-semibold italic">
            "Never ignore oily dripping near electrical range switches; liquid grease conducts electricity and triggers short circuit fires."
          </div>
        `
      },
      'baffle-filters': {
        title: 'Baffle vs Mesh Filters: Which is Best for Your Ventilation?',
        tag: 'Commercial Hoods • Feb 14, 2026 • 5 min read',
        author: 'David Chen',
        role: 'Filtration Specialist',
        initials: 'DC',
        avatarBg: 'bg-emerald-600',
        img: 'assets/images/blog-baffle-filters.jpg',
        bio: 'David Chen has engineered and serviced high-performance filtration systems for over 12 years.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            Grease filters are your kitchen hood's primary fire barrier and air intake mechanism. Choosing between stainless steel baffle filters and aluminum mesh filters directly determines system efficiency and insurance safety compliance.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">Stainless Steel Baffle Filters: The Commercial Gold Standard</h2>
          <p>
            Baffle filters force grease-laden airflow through interlocking S-curved channels. Because grease is heavier than air, centrifugal force slings grease droplets onto the cool stainless steel slats, allowing clean air to pass upward into exhaust ducts.
          </p>
          <p>
            Crucially, UL-listed baffle filters act as certified flame barriers. If cooking oil catches fire on the stove, flames cannot penetrate the interlocking baffles to ignite grease inside duct risers.
          </p>
          <div class="p-6 rounded-2xl bg-emerald-500/10 border-l-4 border-emerald-500 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-semibold italic">
            "Commercial building codes and NFPA 96 strictly prohibit mesh filters on commercial cooktops because mesh allows flames to pass straight through."
          </div>
        `
      },
      'fire-marshal': {
        title: 'Pass Your Annual Fire Marshal Hood Inspection With Zero Violations',
        tag: 'Fire Safety Audits • Feb 08, 2026 • 7 min read',
        author: 'Capt. Marcus Vance',
        role: 'Certified Master Fire Inspector',
        initials: 'MV',
        avatarBg: 'bg-purple-600',
        img: 'assets/images/blog-fire-marshal.jpg',
        bio: 'Capt. Marcus Vance has inspected over 3,000 commercial kitchen exhaust systems across his 18-year career.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            A surprise visit from the municipal fire marshal shouldn't cause panic. With proper inspection logs and certified bare-metal duct cleanings, passing your annual review with zero code violations is completely routine.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">The Top 5 Inspector Scrutiny Points</h2>
          <ul class="list-disc pl-6 space-y-2 rtl:pr-6 rtl:pl-0">
            <li><strong>Duct Access Panels:</strong> Gaskets must be liquid-tight and spaced every 12 feet along horizontal duct runs.</li>
            <li><strong>Rooftop Grease Containment:</strong> Grease boxes on the roof must have fresh hydrophobic absorbent pillows without overflow.</li>
            <li><strong>Combustible Clearance:</strong> Ensure non-insulated single-wall ducts maintain an 18-inch clearance from wood framing.</li>
            <li><strong>Official Inspection Tag:</strong> A valid signed certificate tag must be clearly affixed to the hood exterior.</li>
          </ul>
          <div class="p-6 rounded-2xl bg-purple-500/10 border-l-4 border-purple-500 dark:bg-purple-500/20 text-purple-900 dark:text-purple-200 font-semibold italic">
            "Always keep your digital photographic before-and-after audit logs on hand in your kitchen safety binder."
          </div>
        `
      },
      'rotary-sweeping': {
        title: 'Rotary Power Sweeping vs Manual Scrapers: Soot Tech Breakdown',
        tag: 'Home Chimney Care • Jan 30, 2026 • 5 min read',
        author: 'Sarah Jenkins',
        role: 'Soot Tech Specialist',
        initials: 'SJ',
        avatarBg: 'bg-amber-600',
        img: 'assets/images/blog-rotary-sweeping.jpg',
        bio: 'Sarah Jenkins specializes in modern motorized soot sweeping technology and indoor air hygiene.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            Traditional chimney sweeping relied on stiff wire brushes pushed manually up flues. Modern motorized rotary whip technology has rendered manual scrapers obsolete by removing 4 times more creosote in half the time.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">How Motorized Rotary Power Whips Work</h2>
          <p>
            Rotary power sweeping utilizes a flexible spinning shaft driven by a high-torque variable drill. Specially calibrated nylon or stainless filament strands spin at high RPM, expanding automatically to conform to round, oval, or rectangular chimney shapes.
          </p>
          <p>
            The dynamic whipping action fractures glazed third-stage creosote deposits that manual brushes simply glide over. Simultaneously, HEPA negative air vacuums create continuous suction at the flue base, preventing airborne dust from escaping into living quarters.
          </p>
          <div class="p-6 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 font-semibold italic">
            "Rotary sweeping cleans deep into mortar joints and flue elbows that rigid manual rods cannot negotiate."
          </div>
        `
      },
      'duct-jetting': {
        title: 'Overnight Commercial Duct Jetting: Zero Kitchen Downtime',
        tag: 'Commercial Hoods • Jan 18, 2026 • 8 min read',
        author: 'Elena Rostova',
        role: 'Commercial Operations Lead',
        initials: 'ER',
        avatarBg: 'bg-cyan-600',
        img: 'assets/images/blog-duct-jetting.jpg',
        bio: 'Elena Rostova leads overnight rapid-response commercial cleaning crews across metropolitan restaurant chains.',
        content: `
          <p class="text-lg font-medium text-slate-900 dark:text-slate-100">
            For high-volume 18-hour restaurants, closing the kitchen for scheduled exhaust maintenance is financially unacceptable. Our dedicated overnight crews deploy heavy-duty thermal hydrojetting fleets during off-hours, guaranteeing full bare-metal compliance before morning kitchen shifts arrive.
          </p>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white pt-4">3,000 PSI Hot-Water Thermal Jetting</h2>
          <p>
            Hot water hydrojetting combines 200°F water with 3,000 PSI pressure to liquefy polymerized grease inside vertical risers without caustic chemicals. Our technicians wrap all cooking equipment in 6-mil poly draping with funnel drainage conduits directly to holding tanks.
          </p>
          <p>
            By 5:30 AM, our technicians perform final stainless steel polishing, test exhaust airflow sensors, post certified inspection tags, and remove all shielding, leaving the facility spotless and ready for immediate culinary operations.
          </p>
          <div class="p-6 rounded-2xl bg-cyan-500/10 border-l-4 border-cyan-500 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-200 font-semibold italic">
            "Zero restaurant downtime, zero morning cleanup required—our overnight service leaves your kitchen sparkling clean for breakfast service."
          </div>
        `
      }
    };

    const postAliases = {
      'esp': 'esp-precipitator',
      'esp-filtration': 'esp-precipitator',
      'nfpa': 'nfpa-96',
      'nfpa96': 'nfpa-96',
      'signs': 'warning-signs',
      'warning': 'warning-signs',
      'baffle': 'baffle-filters',
      'filters': 'baffle-filters',
      'fire': 'fire-marshal',
      'inspection': 'fire-marshal',
      'rotary': 'rotary-sweeping',
      'sweeping': 'rotary-sweeping',
      'jetting': 'duct-jetting',
      'duct': 'duct-jetting'
    };

    const resolvedPostKey = postAliases[postKey] || postKey;
    const postData = blogArticlesData[resolvedPostKey] || blogArticlesData['esp-precipitator'];

    document.title = `${postData.title} | ProClean Blog`;
    titleEl.textContent = postData.title;

    const tagEl = document.getElementById('bd-tag');
    if (tagEl) tagEl.innerHTML = `<span>${postData.tag}</span>`;

    const authorNameEl = document.getElementById('bd-author-name');
    if (authorNameEl) authorNameEl.textContent = postData.author;

    const authorRoleEl = document.getElementById('bd-author-role');
    if (authorRoleEl) authorRoleEl.textContent = postData.role;

    const authorAvatarEl = document.getElementById('bd-author-avatar');
    if (authorAvatarEl) {
      authorAvatarEl.textContent = postData.initials;
      authorAvatarEl.className = `w-10 h-10 rounded-full ${postData.avatarBg} text-white flex items-center justify-center font-bold text-sm`;
    }

    const imgEl = document.getElementById('bd-main-img');
    if (imgEl) {
      imgEl.src = postData.img;
      imgEl.alt = postData.title;
    }

    const contentEl = document.getElementById('bd-content');
    if (contentEl) {
      contentEl.innerHTML = postData.content;
    }

    const bioEl = document.getElementById('bd-sidebar-bio');
    if (bioEl) {
      bioEl.textContent = postData.bio;
    }
  };

  initBlogDetailsPage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}





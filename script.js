// Init AOS
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, once: true, easing: 'ease-out-quart' });

  // Current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Background Music
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    // Попытка автоматического воспроизведения
    const playMusic = () => {
      bgMusic.play().catch(err => {
        console.log('Автовоспроизведение заблокировано браузером:', err);
        // Если автовоспроизведение заблокировано, запускаем при первом клике
        document.body.addEventListener('click', () => {
          bgMusic.play();
        }, { once: true });
      });
    };
    playMusic();
  }

  // Hero Swiper (background) - плавное листание вправо
  const heroSwiper = new Swiper('.hero-swiper', {
    effect: 'slide',
    direction: 'horizontal',
    loop: true,
    speed: 800,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: false },
    allowTouchMove: false,
  });

  // Results Swiper - слайдер результатов
  const resultsSwiper = new Swiper('.results-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    loop: true,
    speed: 600,
    navigation: {
      nextEl: '.results-button-next',
      prevEl: '.results-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 20,
      },
    },
  });

  // Burger menu
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const toggleMobileMenu = (open) => {
    if (!burger || !mobileMenu || !mobileMenuOverlay) return;
    burger.setAttribute('aria-expanded', String(open));
    if (open) {
      mobileMenu.hidden = false;
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
    } else {
      mobileMenu.classList.remove('open');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      mobileMenu.addEventListener('transitionend', () => { mobileMenu.hidden = true; }, { once: true });
    }
  };
  burger?.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    toggleMobileMenu(!isOpen);
  });
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMobileMenu(false)));
  mobileMenuOverlay?.addEventListener('click', () => toggleMobileMenu(false));

  // Active navigation link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinksDesktop = document.querySelectorAll('.nav-desktop a');
  const navLinksMobile = document.querySelectorAll('.nav-mobile a');

  const activateNavLink = () => {
    let current = '';
    const headerOffset = 100; // Отступ от верха (высота шапки + небольшой запас)
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY + headerOffset;
      
      // Секция активна, если скролл находится в её пределах
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinksDesktop.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href')?.includes(current)) {
        link.classList.add('active');
      }
    });

    navLinksMobile.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href')?.includes(current)) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateNavLink);
  activateNavLink(); // Call on load

  // Lightbox options (optional tuning)
  if (window.lightbox) {
    lightbox.option({
      fadeDuration: 300,
      imageFadeDuration: 300,
      resizeDuration: 300,
      wrapAround: true,
      alwaysShowNavOnTouchDevices: true,
      disableScrolling: true,
      albumLabel: "Изображение %1 из %2"
    });
  }

  // Teachers drawers with mutual exclusive open
  const drawerButtons = Array.from(document.querySelectorAll('.drawer-toggle'));
  const closeAllDrawers = () => {
    document.querySelectorAll('.teacher-drawer.open').forEach((el) => {
      el.classList.remove('open');
      el.hidden = true;
    });
    drawerButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
  };

  const ensureReviewsSwiper = (container) => {
    if (!container) return null;
    const initialized = container.getAttribute('data-initialized') === 'true';
    if (initialized) {
      // update size after open
      container.swiper && container.swiper.update && container.swiper.update();
      return container.swiper;
    }
    const swiper = new Swiper(container, {
      loop: false,
      speed: 600,
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 16,
      watchSlidesProgress: true,
      navigation: {
        nextEl: container.querySelector('.swiper-button-next'),
        prevEl: container.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 16,
        },
      },
    });
    container.setAttribute('data-initialized', 'true');
    container.swiper = swiper;
    return swiper;
  };

  const ensurePhotosSwiper = (container) => {
    if (!container) return null;
    const initialized = container.getAttribute('data-initialized') === 'true';
    if (initialized) {
      container.swiper && container.swiper.update && container.swiper.update();
      return container.swiper;
    }
    const swiper = new Swiper(container, {
      loop: false,
      speed: 600,
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 12,
      grabCursor: true,
      allowTouchMove: true,
      navigation: {
        nextEl: container.querySelector('.swiper-button-next'),
        prevEl: container.querySelector('.swiper-button-prev'),
      },
    });
    container.setAttribute('data-initialized', 'true');
    container.swiper = swiper;
    
    // Инициализация модального окна для этой галереи
    initGalleryModal(container);
    
    return swiper;
  };

  // Инициализация модального окна для галереи
  function initGalleryModal(container) {
    const galleryItems = container.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalClose = modal.querySelector('.gallery-modal__close');
    const modalImage = modal.querySelector('.gallery-modal__image');

    // Обработка кликов по изображениям
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        modalImage.src = img.getAttribute('data-full');
        modalImage.alt = img.alt;
        
        // Вычисляем ширину скроллбара и компенсируем сдвиг
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
        
        modal.classList.add('active');
      });
    });

    // Закрытие модального окна по клику на крестик
    modalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    // Закрытие по клику вне изображения
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('gallery-modal__content')) {
        closeModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Функция закрытия модального окна
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      // Очищаем src изображения после закрытия и завершения анимации
      setTimeout(() => {
        modalImage.src = '';
      }, 300);
    }
  }

  const stopAllReviewSwipers = () => {
    document.querySelectorAll('.reviews-swiper[data-initialized="true"]').forEach((el) => {
      el.swiper && el.swiper.autoplay && el.swiper.autoplay.stop();
    });
  };

  const stopReviewsInDrawer = (drawer) => {
    const el = drawer.querySelector('.reviews-swiper[data-initialized="true"]');
    if (el && el.swiper && el.swiper.autoplay) el.swiper.autoplay.stop();
  };

  const setDrawerPanel = (drawer, panel, btn, withFlash = false) => {
    const reviewsPanel = drawer.querySelector('.reviews-panel');
    const photosPanel = drawer.querySelector('.photos-panel');

    const applyPanel = () => {
      if (panel === 'reviews') {
        reviewsPanel?.removeAttribute('hidden');
        photosPanel?.setAttribute('hidden', '');
        const reviewsSwiperEl = drawer.querySelector('.reviews-swiper');
        ensureReviewsSwiper(reviewsSwiperEl);
      } else {
        photosPanel?.removeAttribute('hidden');
        reviewsPanel?.setAttribute('hidden', '');
        stopReviewsInDrawer(drawer);
        const photosSwiperEl = drawer.querySelector('.photos-swiper-gallery');
        ensurePhotosSwiper(photosSwiperEl);
      }

      drawer.dataset.openPanel = panel;
      drawer.setAttribute('aria-labelledby', btn.id || '');

      const theCard = btn.closest('.teacher-card');
      const actionsContainer = theCard?.querySelector('.teacher-actions');
      
      theCard?.querySelectorAll('.drawer-toggle').forEach((t) => {
        const tPanel = t.getAttribute('data-panel');
        const expanded = drawer.classList.contains('open') && tPanel === panel;
        t.setAttribute('aria-expanded', String(expanded));
        
        // Управление классом active для сегментированного контрола
        if (drawer.classList.contains('open') && tPanel === panel) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      // Управление data-active для анимации перетекания
      if (actionsContainer && drawer.classList.contains('open')) {
        actionsContainer.setAttribute('data-active', panel);
      } else if (actionsContainer) {
        actionsContainer.removeAttribute('data-active');
      }
    };

    if (withFlash) {
      drawer.classList.add('flash-transition');
      stopAllReviewSwipers();
      setTimeout(() => {
        applyPanel();
        drawer.addEventListener('animationend', () => {
          drawer.classList.remove('flash-transition');
        }, { once: true });
      }, 200); // Середина анимации flash
    } else {
      applyPanel();
    }
  };

  drawerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const panel = btn.getAttribute('data-panel'); // 'reviews' | 'photos'
      if (!targetId || !panel) return;
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');
      const currentPanel = drawer.dataset.openPanel;
      const allCardDrawers = Array.from(document.querySelectorAll('.teacher-drawer'));

      // Close other drawers and stop their sliders
      allCardDrawers.forEach((d) => {
        if (d !== drawer) {
          d.classList.remove('open');
          d.hidden = true;
          stopReviewsInDrawer(d);
        }
      });

      // Open drawer if closed
      if (!isOpen) {
        drawer.hidden = false;
        requestAnimationFrame(() => {
          drawer.classList.add('open');
          setDrawerPanel(drawer, panel, btn, false);
        });
        return;
      }

      // Drawer is already open
      if (currentPanel === panel) {
        // Повторное нажатие на ту же кнопку — закрываем дровер
        drawer.classList.remove('open');
        stopReviewsInDrawer(drawer);
        drawer.addEventListener('transitionend', () => { 
          drawer.hidden = true; 
          drawer.dataset.openPanel = ''; 
        }, { once: true });
        
        // Убираем active класс со всех кнопок и data-active
        const theCard = btn.closest('.teacher-card');
        const actionsContainer = theCard?.querySelector('.teacher-actions');
        
        theCard?.querySelectorAll('.drawer-toggle').forEach((t) => {
          t.setAttribute('aria-expanded', 'false');
          t.classList.remove('active');
        });
        
        actionsContainer?.removeAttribute('data-active');
      } else {
        // Переключение на другую панель с flash-эффектом
        setDrawerPanel(drawer, panel, btn, true);
      }
    });
  });

  // Results donuts: create SVGs and animate on intersection
  const createDonut = (host) => {
    const label = host.getAttribute('data-label') || '';
    const valFrom = host.getAttribute('data-from');
    const valTo = host.getAttribute('data-to');
    const target = Number(valFrom ?? valTo ?? 0);

    const size = 120; const r = 52; const c = 2 * Math.PI * r;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.style.transform = 'rotate(-90deg)';

    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('class', 'track');
    track.setAttribute('cx', '60'); track.setAttribute('cy', '60'); track.setAttribute('r', String(r));

    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    indicator.setAttribute('class', 'indicator');
    indicator.setAttribute('cx', '60'); indicator.setAttribute('cy', '60'); indicator.setAttribute('r', String(r));
    indicator.setAttribute('stroke-dasharray', String(c));
    indicator.setAttribute('stroke-dashoffset', String(c));

    svg.appendChild(track); svg.appendChild(indicator);
    host.appendChild(svg);

    const labelWrap = document.createElement('div');
    labelWrap.className = 'label';
    const title = document.createElement('span'); title.className = 'title'; title.textContent = label;
    const value = document.createElement('span'); value.className = 'value'; value.textContent = String(target);
    labelWrap.appendChild(title); labelWrap.appendChild(value);
    host.appendChild(labelWrap);

    host.dataset.circumference = String(c);
    host.dataset.target = String(target);
    host._indicator = indicator;
    host._valueEl = value;
  };

  document.querySelectorAll('.donut').forEach(createDonut);

  const animateDonut = (host) => {
    if (host.dataset.animated === 'true') return;
    host.dataset.animated = 'true';
    const c = Number(host.dataset.circumference || 0);
    const target = Number(host.dataset.target || 0);
    const indicator = host._indicator;
    const valueEl = host._valueEl;
    const duration = 900;
    const t0 = performance.now();
    const from = 0; const to = target;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(from + (to - from) * ease);
      const offset = c * (1 - cur / 100);
      indicator.setAttribute('stroke-dashoffset', String(offset));
      valueEl.textContent = String(cur);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.donut').forEach(animateDonut);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.result-card').forEach((card) => io.observe(card));

  // Reviews Sliders
  const reviewsSwiperRight = new Swiper('.reviews-swiper-right', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 8000,
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freeMode: true,
    freeModeMomentum: false,
    allowTouchMove: false,
    simulateTouch: false,
    touchRatio: 0,
    resistance: false,
  });

  const reviewsSwiperLeft = new Swiper('.reviews-swiper-left', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 8000,
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: true,
    },
    freeMode: true,
    freeModeMomentum: false,
    allowTouchMove: false,
    simulateTouch: false,
    touchRatio: 0,
    resistance: false,
  });

  // Остановка слайдера при наведении на карточку отзыва
  document.querySelectorAll('.review-card').forEach((card) => {
    const swiperEl = card.closest('.reviews-swiper');
    const isRightSwiper = swiperEl.classList.contains('reviews-swiper-right');
    const swiper = isRightSwiper ? reviewsSwiperRight : reviewsSwiperLeft;
    
    card.addEventListener('mouseenter', () => {
      swiper.autoplay.pause();
    });
    
    card.addEventListener('mouseleave', () => {
      swiper.autoplay.resume();
    });
  });

  // Review Modal
  const reviewModal = document.querySelector('.review-modal');
  const reviewModalClose = document.querySelector('.review-modal__close');
  const reviewModalStars = document.querySelector('.review-modal__stars');
  const reviewModalText = document.querySelector('.review-modal__text');
  const reviewModalAuthor = document.querySelector('.review-modal__author');

  let pausedSwipers = [];

  const openReviewModal = (stars, text, author) => {
    reviewModalStars.textContent = stars;
    reviewModalText.textContent = text;
    reviewModalAuthor.textContent = author;
    
    reviewModal.classList.add('active');
    
    // Останавливаем оба слайдера и сохраняем их состояние
    pausedSwipers = [];
    if (reviewsSwiperRight.autoplay.running) {
      reviewsSwiperRight.autoplay.pause();
      pausedSwipers.push(reviewsSwiperRight);
    }
    if (reviewsSwiperLeft.autoplay.running) {
      reviewsSwiperLeft.autoplay.pause();
      pausedSwipers.push(reviewsSwiperLeft);
    }
    
    // Блокировка скролла с компенсацией scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeReviewModal = () => {
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Возобновляем только те слайдеры, которые были остановлены
    pausedSwipers.forEach((swiper) => {
      swiper.autoplay.resume();
    });
    pausedSwipers = [];
  };

  reviewModalClose?.addEventListener('click', closeReviewModal);
  reviewModal?.addEventListener('click', (e) => {
    if (e.target === reviewModal) closeReviewModal();
  });

  // Обработка кликов на кнопки "Читать полностью"
  document.querySelectorAll('.btn-read-more').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.review-card');
      const stars = card.querySelector('.stars').textContent;
      const text = card.querySelector('p').textContent;
      const author = card.querySelector('.author').textContent;
      openReviewModal(stars, text, author);
    });
  });

  // FAQ accordion
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Закрываем все остальные элементы
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Переключаем текущий элемент
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    });
  }
  
  initFAQ();

  // Map route link (координаты: 45.033273, 39.044411)
  const addrEl = document.getElementById('address-text');
  const routeBtn = document.getElementById('route-btn');
  if (addrEl && routeBtn) {
    const coords = '45.033273,39.044411';
    const url = `https://yandex.ru/maps/?rtext=~${coords}`;
    routeBtn.setAttribute('href', url);
  }
});



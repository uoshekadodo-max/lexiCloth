export class ProductSlider {
  constructor(options) {
    this.wrapper = document.querySelector(options.wrapper);
    this.track = document.querySelector(options.track);
    this.prevBtn = document.querySelector(options.prev);
    this.nextBtn = document.querySelector(options.next);

    this.cards = [];
    this.cardWidth = 0;
    this.currentIndex = 0;
    this.interval = null;
    this.isAnimating = false;
    this.autoSpeed = options.autoSpeed || 3000;
    this.cloneCount = 0;

    this.dragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.previousTranslate = 0;
    this.animationID = 0;

    // Only initialize if core elements exist in DOM
    if (this.wrapper && this.track) {
      this.init();
    }
  }

  init() {
    this.cards = [...this.track.children];
    if (this.cards.length === 0) return;

    this.cardWidth = this.cards[0].offsetWidth + 20;
    this.cloneCards();
    this.currentIndex = this.cloneCount;
    this.jumpTo(this.currentIndex);
    this.addArrowEvent();
    this.addDragEvents();
    this.addHoverEvents();
    this.disableImageDrag();
    this.handleResize();
    this.addKeyboardEvents();
    this.startAuto();

    this.track.addEventListener("transitionend", () => {
      this.checkLoop();
    });
  }

  cloneCards() {
    this.cloneCount = Math.min(4, this.cards.length);
    const first = this.cards.slice(0, this.cloneCount);
    const last = this.cards.slice(-this.cloneCount);

    last.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("clone");
      this.track.prepend(clone);
    });

    // first.forEach((card) => {
    //   const clone = card.cloneNode(true);
    //   clone.classList.add("clone");
    //   this.track.appendChild(clone); // Fixed: appended to end instead of prepend
    // });
  }

  jumpTo(index) {
    this.track.style.transition = "none";
    this.track.style.transform = `translateX(-${index * this.cardWidth}px)`;
    // Force browser to apply the jump immediately
    this.track.offsetHeight;
  }

  slideTo(index) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentIndex = index;
    this.track.style.transition = "transform .5s ease";
    this.track.style.transform = `translateX(-${this.currentIndex * this.cardWidth}px)`;
    this.track.offsetHeight;
  }

  next() {
    this.slideTo(this.currentIndex + 1);
  }

  prev() {
    this.slideTo(this.currentIndex - 1);
  }

  checkLoop() {
    this.isAnimating = false;
    const total = this.track.children.length;

    if (this.currentIndex >= total - this.cloneCount) {
      this.currentIndex = this.cloneCount;
      this.jumpTo(this.currentIndex);
    }

    if (this.currentIndex < this.cloneCount) {
      this.currentIndex = total - this.cloneCount * 2;
      this.jumpTo(this.currentIndex);
    }
  }

  addArrowEvent() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.stopAuto();
        this.next();
        this.startAuto();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.stopAuto();
        this.prev();
        this.startAuto();
      });
    }
  }

  startAuto() {
    this.stopAuto();
    this.interval = setInterval(() => {
      this.next();
    }, this.autoSpeed);
  }

  stopAuto() {
    clearInterval(this.interval);
  }

  addDragEvents() {
    this.wrapper.addEventListener("mousedown", this.dragStart.bind(this));
    window.addEventListener("mouseup", this.dragEnd.bind(this));
    window.addEventListener("mousemove", this.dragMove.bind(this));

    this.wrapper.addEventListener("touchstart", this.dragStart.bind(this), {
      passive: true,
    });
    window.addEventListener("touchend", this.dragEnd.bind(this));
    window.addEventListener("touchmove", this.dragMove.bind(this), {
      passive: true,
    });
  }

  dragStart(e) {
    this.stopAuto();
    this.dragging = true;
    this.wrapper.classList.add("active");

    this.startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX; // Fixed: clientX syntax typo
    this.previousTranslate = -this.currentIndex * this.cardWidth;
  }

  dragMove(e) {
    if (!this.dragging) return;

    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const moved = currentX - this.startX;

    this.currentTranslate = this.previousTranslate + moved;
    this.track.style.transition = "none";
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  dragEnd() {
    if (!this.dragging) return;

    this.dragging = false;
    this.wrapper.classList.remove("active");

    const moved = this.currentTranslate - this.previousTranslate;
    this.previousTranslate = -this.currentIndex * this.cardWidth;

    // Swipe threshold = 25% of one card's width
    const threshold = this.cardWidth * 0.25;

    if (moved < -threshold) {
      this.next();
    } else if (moved > threshold) {
      this.prev();
    } else {
      this.slideTo(this.currentIndex);
    }

    this.startAuto();
  }

  addHoverEvents() {
    this.wrapper.addEventListener("mouseenter", () => {
      this.stopAuto();
    });

    this.wrapper.addEventListener("mouseleave", () => {
      this.startAuto();
    });
  }

  handleResize() {
    window.addEventListener("resize", () => {
      const firstCard = this.track.querySelector(".product-card") || this.cards[0];
      if (firstCard) {
        this.cardWidth = firstCard.offsetWidth + 20;
        this.jumpTo(this.currentIndex);
      }
    });
  }

  addKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        this.stopAuto();
        this.next();
        this.startAuto();
      }

      if (e.key === "ArrowLeft") {
        this.stopAuto();
        this.prev();
        this.startAuto();
      }
    });
  }

  disableImageDrag() {
    this.track.querySelectorAll("img").forEach((img) => {
      img.setAttribute("draggable", false);
    });
  }
}
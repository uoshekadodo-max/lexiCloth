let currentSlide = 0;

const slides = document.querySelector(".slides");
const allSlides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

export function initHeroSlider() {

    if (
        !slides ||
        !allSlides.length ||
        !dots.length
    ) return;

    function showSlide() {

        if (currentSlide >= allSlides.length) {

            currentSlide = 0;

        }

        if (currentSlide < 0) {

            currentSlide = allSlides.length - 1;

        }

        slides.style.transform =
            `translateX(-${currentSlide * 100}%)`;

        dots.forEach(dot =>
            dot.classList.remove("active")
        );

        dots[currentSlide].classList.add("active");

    }

    next?.addEventListener("click", () => {

        currentSlide++;

        showSlide();

    });

    prev?.addEventListener("click", () => {

        currentSlide--;

        showSlide();

    });

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            currentSlide = index;

            showSlide();

        });

    });

    setInterval(() => {

        currentSlide++;

        showSlide();

    }, 5000);

    showSlide();

}
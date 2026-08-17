export function initWardrobe() {
    const wardrobe = document.querySelector(".wardrobe");

    if (wardrobe) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wardrobe.classList.add("open");
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(wardrobe);
    }

    const clothes = document.querySelectorAll(".cloth");

    clothes.forEach(cloth => {
        cloth.addEventListener("click", () => {
            clothes.forEach(item => {
                if (item !== cloth) {
                    item.classList.remove("active");
                    
                    const label = item.querySelector(".label");
                    if (label) {
                        label.classList.remove("flip");
                    }
                }
            });

            cloth.classList.toggle("active");
        });
    });

    document.querySelectorAll(".front").forEach(front => {
        front.addEventListener("click", (e) => {
            e.stopPropagation();
            if (front.parentElement) {
                front.parentElement.classList.add("flip");
            }
        });
    });

    document.querySelectorAll(".back").forEach(back => {
        back.addEventListener("click", (e) => {
            e.stopPropagation();
            if (back.parentElement) {
                back.parentElement.classList.remove("flip");
            }
        });
    });
}
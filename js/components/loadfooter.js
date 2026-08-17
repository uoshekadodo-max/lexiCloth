async function loadFooter() {

    const footerContainer =
        document.getElementById("footer");

    if (!footerContainer) return;


    try {

        const response =
            await fetch("/html/component/footer.html");

        if (!response.ok) {

            throw new Error(
                `Footer failed to load: ${response.status}`
            );

        }


        footerContainer.innerHTML =
            await response.text();


        initializeBackToTop();


    } catch (error) {

        console.error(
            "Footer loading error:",
            error
        );

    }

}


function initializeBackToTop() {

    const backToTop =
        document.getElementById("backToTop");

    if (!backToTop) return;


    const updateBackToTop = () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    };


    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );


    updateBackToTop();

}


loadFooter();
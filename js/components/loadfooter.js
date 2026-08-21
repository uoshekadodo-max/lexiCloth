async function loadFooter() {

    const footerContainer =
        document.getElementById("footer");

    if (!footerContainer) return;


    try {

     const footerPath = window.location.pathname.includes("/html/")
    ? "./component/footer.html"
    : "./html/component/footer.html";

const response = await fetch(footerPath);

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
import globalSearch from "./globalSearch.js";


async function loadNavbar() {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;


    try {

        // Determine which folder the current page is in
        const isHtmlPage =
            window.location.pathname.includes("/html/");


        // Load the shared navbar
        const navbarPath = isHtmlPage
            ? "./component/navbar.html"
            : "./html/component/navbar.html";


        const response = await fetch(navbarPath);


        if (!response.ok) {

            throw new Error(
                `Navbar failed to load: ${response.status}`
            );

        }


        // Insert navbar HTML
        navbar.innerHTML = await response.text();


        /*
         * ------------------------------------------------
         * FIX LOGO PATH
         * ------------------------------------------------
         */

        const logo = navbar.querySelector(".logo");
        const logoImage = logo?.querySelector("img");


        if (logo && logoImage) {

            if (isHtmlPage) {

                // Pages inside /html/
                logo.href = "../index.html";
                logoImage.src = "../images/logo.webp";

            } else {

                // Homepage
                logo.href = "./index.html";
                logoImage.src = "./images/logo.webp";

            }

        }


        // Initialize navbar JavaScript
        await import("./navbar.js");


        // Initialize global search
        globalSearch.init();


    } catch (error) {

        console.error(
            "Failed to load navbar:",
            error
        );

    }

}


loadNavbar();
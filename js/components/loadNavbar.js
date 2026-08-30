import globalSearch from "./globalSearch.js";


async function loadNavbar() {

    const navbar =
        document.getElementById("navbar");

    if (!navbar) return;


    try {

     const navbarPath = window.location.pathname.includes("/html/")
    ? "./component/navbar.html"
    : "./html/component/navbar.html";

const response = await fetch(navbarPath);


        if (!response.ok) {

            throw new Error(
                `Navbar failed to load: ${response.status}`
            );

        }


        navbar.innerHTML =
            await response.text();


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
// =========================================================
// LEXICLOTH CONTACT FORM
// Frontend validation only
// Ready for PHP/API connection later
// =========================================================

const contactForm =
    document.getElementById("contactForm");

const contactSubmit =
    document.getElementById("contactSubmit");

const formStatus =
    document.getElementById("contactFormStatus");

const messageInput =
    document.getElementById("contactMessage");

const messageCount =
    document.getElementById("messageCount");


if (contactForm) {

    // =====================================================
    // MESSAGE COUNTER
    // =====================================================

    if (messageInput && messageCount) {

        const updateMessageCount = () => {

            messageCount.textContent =
                `${messageInput.value.length} / 1500`;

        };

        messageInput.addEventListener(
            "input",
            updateMessageCount
        );

        updateMessageCount();

    }


    // =====================================================
    // FORM SUBMISSION
    // =====================================================

    contactForm.addEventListener(
        "submit",
        handleContactSubmit
    );

}


// =========================================================
// SUBMIT HANDLER
// =========================================================

function handleContactSubmit(event) {

    event.preventDefault();


    clearFormErrors();

    setFormStatus("", "");


    const formData =
        new FormData(contactForm);


    const name =
        formData.get("name")?.trim() || "";

    const email =
        formData.get("email")?.trim() || "";

    const subject =
        formData.get("subject")?.trim() || "";

    const message =
        formData.get("message")?.trim() || "";


    let valid = true;


    // =====================================================
    // NAME
    // =====================================================

    if (name.length < 2) {

        showFormError(
            "name",
            "Please enter your full name."
        );

        valid = false;

    }


    // =====================================================
    // EMAIL
    // =====================================================

    if (!isValidEmail(email)) {

        showFormError(
            "email",
            "Please enter a valid email address."
        );

        valid = false;

    }


    // =====================================================
    // SUBJECT
    // =====================================================

    if (subject.length < 3) {

        showFormError(
            "subject",
            "Please enter a subject."
        );

        valid = false;

    }


    // =====================================================
    // MESSAGE
    // =====================================================

    if (message.length < 10) {

        showFormError(
            "message",
            "Please enter at least 10 characters."
        );

        valid = false;

    }


    if (!valid) {

        return;

    }


    // =====================================================
    // TEMPORARY FRONTEND SUCCESS
    //
    // Later this section will become:
    // fetch("/api/contact.php", ...)
    // =====================================================

    submitContactForm({

        name,
        email,
        subject,
        message

    });

}


// =========================================================
// TEMPORARY SUBMISSION
// =========================================================

function submitContactForm(data) {

    setLoading(true);


    // Simulates a short request.
    // This will later be replaced by PHP/API.

    setTimeout(() => {

        console.log(
            "Contact form data:",
            data
        );


        contactForm.reset();


        if (messageCount) {

            messageCount.textContent =
                "0 / 1500";

        }


        setLoading(false);


        setFormStatus(
            "Your message has been received. We'll get back to you soon.",
            "success"
        );


    }, 800);

}


// =========================================================
// EMAIL VALIDATION
// =========================================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// =========================================================
// SHOW ERROR
// =========================================================

function showFormError(field, message) {

    const error =
        document.querySelector(
            `[data-error="${field}"]`
        );


    if (error) {

        error.textContent = message;

    }


    const input =
        document.getElementById(
            `contact${
                field.charAt(0).toUpperCase()
                + field.slice(1)
            }`
        );


    if (input) {

        input
            .closest(".form-group")
            ?.classList.add("has-error");

    }

}


// =========================================================
// CLEAR ERRORS
// =========================================================

function clearFormErrors() {

    document
        .querySelectorAll(".form-error")
        .forEach(error => {

            error.textContent = "";

        });


    document
        .querySelectorAll(
            ".contact-form .form-group"
        )
        .forEach(group => {

            group.classList.remove(
                "has-error"
            );

        });

}


// =========================================================
// STATUS MESSAGE
// =========================================================

function setFormStatus(
    message,
    type
) {

    if (!formStatus) return;


    formStatus.textContent =
        message;

    formStatus.className =
        `form-status ${type}`.trim();

}


// =========================================================
// LOADING
// =========================================================

function setLoading(isLoading) {

    if (!contactSubmit) return;


    contactSubmit.disabled =
        isLoading;


    contactSubmit.classList.toggle(
        "loading",
        isLoading
    );

}
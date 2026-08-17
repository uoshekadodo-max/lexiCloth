class ToastService {

    constructor() {

        this.container = document.getElementById("toast-container");

        if (!this.container) {

            this.container = document.createElement("div");

            this.container.id = "toast-container";

            document.body.appendChild(this.container);

        }

    }

    show(message, type = "success", duration = 3000) {

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        toast.textContent = message;

        this.container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            toast.addEventListener("transitionend", () => {

                toast.remove();

            }, { once: true });

        }, duration);

    }

    success(message) {

        this.show(message, "success");

    }

    error(message) {

        this.show(message, "error");

    }

    warning(message) {

        this.show(message, "warning");

    }

    info(message) {

        this.show(message, "info");

    }

}

const toast = new ToastService();

export default toast;
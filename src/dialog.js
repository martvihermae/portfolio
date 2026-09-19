// Simple HTML overlay dialog used to show POI content (CV, Skills, Portfolio, ...).
export class Dialog {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'dialog-overlay hidden';

        this.box = document.createElement('div');
        this.box.className = 'dialog-box';

        this.titleEl = document.createElement('h2');
        this.bodyEl = document.createElement('div');
        this.bodyEl.className = 'dialog-body';

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'dialog-close';
        this.closeButton.textContent = '\u00D7';
        this.closeButton.addEventListener('click', () => this.hide());

        this.box.append(this.closeButton, this.titleEl, this.bodyEl);
        this.overlay.appendChild(this.box);

        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) this.hide();
        });

        document.body.appendChild(this.overlay);
    }

    show({ title, body }) {
        this.titleEl.textContent = title;
        this.bodyEl.innerHTML = body;
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.overlay.classList.add('hidden');
    }

    get isOpen() {
        return !this.overlay.classList.contains('hidden');
    }
}

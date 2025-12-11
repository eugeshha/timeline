export default class Modal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "coordsModal";
      this.container.className = "modal";
      document.body.append(this.container);
    }
  }

  show(title, message, onConfirm, onCancel) {
    this.container.innerHTML = `
      <div class="modal-content">
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-form">
          <input type="text" id="coordsInput" placeholder="51.50851, −0.12572" />
          <div id="coordsError" class="error-message"></div>
        </div>
        <div class="modal-buttons">
          <button id="modalConfirm" class="btn-primary">OK</button>
          <button id="modalCancel" class="btn-secondary">Отмена</button>
        </div>
      </div>
    `;

    this.container.style.display = "flex";

    const input = this.container.querySelector("#coordsInput");
    const errorDiv = this.container.querySelector("#coordsError");
    const confirmBtn = this.container.querySelector("#modalConfirm");
    const cancelBtn = this.container.querySelector("#modalCancel");

    input.focus();

    const handleConfirm = () => {
      const value = input.value.trim();
      try {
        onConfirm(value);
        this.hide();
      } catch (error) {
        errorDiv.textContent = error.message;
      }
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", () => {
      if (onCancel) onCancel();
      this.hide();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleConfirm();
      } else if (e.key === "Escape") {
        if (onCancel) onCancel();
        this.hide();
      }
    });
  }

  hide() {
    this.container.style.display = "none";
    this.container.innerHTML = "";
  }
}


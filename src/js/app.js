import Timeline from "./Timeline.js";
import TextPost from "./TextPost.js";
import GeolocationService from "./GeolocationService.js";
import Modal from "./Modal.js";
import { parseCoordinates } from "./utils/coordinates.js";

export default class App {
  constructor() {
    this.timeline = new Timeline();
    this.modal = new Modal("coordsModal");
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const input = document.getElementById("postInput");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handlePostSubmit();
      }
    });

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.handlePostSubmit());
    }
  }

  async handlePostSubmit() {
    const input = document.getElementById("postInput");
    const text = input.value.trim();

    if (!text) return;

    try {
      const coordinates = await GeolocationService.getCurrentPosition();
      this.createTextPost(text, coordinates);
      input.value = "";
    } catch {
      this.showCoordinatesModal(text);
    }
  }

  showCoordinatesModal(text) {
    this.modal.show(
      "Координаты недоступны",
      "Не удалось получить ваши координаты. Пожалуйста, введите их вручную:",
      (coordsInput) => {
        const coordinates = parseCoordinates(coordsInput);
        this.createTextPost(text, coordinates);
        const input = document.getElementById("postInput");
        input.value = "";
      },
    );
  }

  createTextPost(text, coordinates) {
    const post = new TextPost(text, coordinates);
    this.timeline.addPost(post);
    this.render();
  }

  render() {
    const container = document.getElementById("timelineContainer");
    if (!container) return;

    container.innerHTML = "";

    const posts = this.timeline.getAllPosts();

    if (posts.length === 0) {
      container.innerHTML = '<div class="empty-state">Нет записей</div>';
      return;
    }

    posts.forEach((post) => {
      const postElement = this.createPostElement(post);
      container.append(postElement);
    });
  }

  createPostElement(post) {
    const div = document.createElement("div");
    div.className = "post post-text";

    const header = document.createElement("div");
    header.className = "post-header";

    const date = document.createElement("div");
    date.className = "post-date";
    date.textContent = this.formatDate(post.createdAt);

    const content = document.createElement("div");
    content.className = "post-content";
    content.textContent = post.text;

    const coords = document.createElement("div");
    coords.className = "post-coordinates";
    coords.textContent = post.formatCoordinates();

    header.append(date);
    div.append(header, content, coords);

    return div;
  }

  formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}

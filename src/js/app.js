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
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "только что";
    } else if (minutes < 60) {
      return `${minutes} ${this.pluralize(minutes, "минуту", "минуты", "минут")} назад`;
    } else if (hours < 24) {
      return `${hours} ${this.pluralize(hours, "час", "часа", "часов")} назад`;
    } else if (days < 7) {
      return `${days} ${this.pluralize(days, "день", "дня", "дней")} назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  pluralize(count, one, few, many) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 19) {
      return many;
    }
    if (mod10 === 1) {
      return one;
    }
    if (mod10 >= 2 && mod10 <= 4) {
      return few;
    }
    return many;
  }
}

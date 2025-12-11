export default class TextPost {
  constructor(text, coordinates) {
    this.id = Date.now().toString();
    this.type = "text";
    this.text = text;
    this.coordinates = coordinates;
    this.createdAt = new Date();
  }

  formatCoordinates() {
    return `${this.coordinates.latitude.toFixed(5)}, ${this.coordinates.longitude.toFixed(5)}`;
  }
}


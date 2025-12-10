export default class Timeline {
  constructor() {
    this.posts = [];
  }

  addPost(post) {
    this.posts.unshift(post);
  }

  getAllPosts() {
    return this.posts;
  }

  getPostsByType(type) {
    return this.posts.filter((post) => post.type === type);
  }
}

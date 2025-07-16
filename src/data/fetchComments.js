import axios from "axios";

export async function fetchCommentsWithPostTitles() {
  try {
    const [commentsRes, postsRes] = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/comments"),
      axios.get("https://jsonplaceholder.typicode.com/posts")
    ]);

    const posts = postsRes.data;
    const comments = commentsRes.data;

    const postMap = {};
    posts.forEach((post) => {
      postMap[post.id] = post.title;
    });

    const merged = comments.map((comment) => ({
      ...comment,
      postTitle: postMap[comment.postId] || "Unknown Post"
    }));

    return merged;
  } catch (error) {
    console.error("Error fetching comments or posts:", error);
    return [];
  }
}

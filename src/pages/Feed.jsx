import { useEffect, useState } from "react";
import API from "../services/api";
import CreatePost from "../component/CreatePost";
import PostCard from "../component/PostCard";
import { Container } from "@mui/material";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="sm">
      <CreatePost refresh={fetchPosts} />
      {posts.map(post => (
        <PostCard key={post._id} post={post} refresh={fetchPosts} />
      ))}
    </Container>
  );
};

export default Feed;

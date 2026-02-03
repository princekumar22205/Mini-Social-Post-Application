import { Card, CardContent, Typography, Button, Avatar, Stack, IconButton, Grid, Divider, Box, Dialog, TextField } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from "react";
import API from "../services/api";

const PostCard = ({ post, refresh }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    await API.post(`/posts/${post._id}/like`);
    refresh();
  };

  const handleCommentClick = () => {
    setCommentOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText("");
      setCommentOpen(false);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  const date = new Date(post.createdAt);

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDay = date.toLocaleDateString([], {
    weekday: "short",
  });

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Avatar
            src={post.profileImage || ""}
            sx={{ width: 45, height: 45 }}
          >
            {post.username?.[0]?.toUpperCase()}
          </Avatar>
          <Stack direction="column">
            <Typography fontWeight="bold">{post.username}</Typography>
            <Typography variant="caption" color="textSecondary">
              {formattedDay} {formattedTime}
            </Typography>
          </Stack>
        </Stack>
        <Typography>{post.text}</Typography>

        {post.image && (
          <img src={post.image} alt="" width="100%" style={{ marginTop: 10 }} />
        )}

        <Divider sx={{ my: 2 }} />
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item>
            <Box textAlign="center">
              <IconButton onClick={handleLike} aria-label="like">
                <FavoriteBorderIcon />
              </IconButton>
              <Typography variant="caption">{post.likes.length}</Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box textAlign="center">
              <IconButton onClick={handleCommentClick} aria-label="comment">
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="caption">{post.comments.length}</Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box textAlign="center">
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <Typography variant="caption">0</Typography>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={commentOpen} onClose={() => setCommentOpen(false)} maxWidth="sm" fullWidth>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Comments</Typography>
            
            {/* Display existing comments */}
            {post.comments && post.comments.length > 0 && (
              <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                {post.comments.map((comment, idx) => (
                  <Box key={idx} sx={{ mb: 1.5, pb: 1, borderBottom: idx < post.comments.length - 1 ? "1px solid #eee" : "none" }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="caption" fontWeight="bold">
                        {comment.username}
                      </Typography>
                      {comment.createdAt && (
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Add new comment */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Add a comment</Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                Post
              </Button>
              <Button variant="outlined" onClick={() => setCommentOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PostCard;

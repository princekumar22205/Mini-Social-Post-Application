import { Card, CardContent, Typography, Button, Avatar, Stack, IconButton, Grid, Divider, Box } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import API from "../services/api";

const PostCard = ({ post, refresh }) => {
  const handleLike = async () => {
    await API.post(`/posts/${post._id}/like`);
    refresh();
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
              <IconButton aria-label="comment">
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
      </CardContent>
    </Card>
  );
};

export default PostCard;

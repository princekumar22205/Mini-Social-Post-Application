import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Popover,
  Box
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CampaignIcon from "@mui/icons-material/Campaign";

import API from "../services/api";

const CreatePost = ({ refresh }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState("all");

  const handlePost = async () => {
    if (!text && !imageUrl) return;

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (selectedFile) formData.append("image", selectedFile);

      await API.post("/posts", formData);

      setText("");
      setImageUrl("");
      setSelectedFile(null);
      refresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  const EMOJIS = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😊",
    "😍",
    "🤩",
    "😎",
    "😢",
    "😡",
    "👍",
    "👎",
    "👏",
    "🙌",
    "🔥",
    "🎉",
    "❤️",
    "💯",
  ];

  const openEmoji = Boolean(emojiAnchorEl);
  const handleEmojiClick = (e) => setEmojiAnchorEl(e.currentTarget);
  const handleEmojiClose = () => setEmojiAnchorEl(null);

  return (
    <Card sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight="bold">Create Post</Typography>

          <ToggleButtonGroup
            value={tab}
            exclusive
            size="small"
            onChange={(e, val) => val && setTab(val)}
          >
            <ToggleButton value="all">All Posts</ToggleButton>
            <ToggleButton value="promo">Promotions</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Text Input */}
        <TextField
          fullWidth
          placeholder="What's on your mind?"
          multiline
          minRows={2}
          variant="standard"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Bottom Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          {/* Icons */}
          <Stack direction="row" spacing={1}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <IconButton onClick={handleFileClick}>
              <ImageIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleEmojiClick}>
              <EmojiEmotionsIcon color="primary" />
            </IconButton>
            <Popover
              open={openEmoji}
              anchorEl={emojiAnchorEl}
              onClose={handleEmojiClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(6, 36px)', gap: 1 }}>
                {EMOJIS.map((e) => (
                  <Button
                    key={e}
                    onClick={() => setText((prev) => prev + e)}
                    sx={{ minWidth: 36, p: 0, fontSize: 20 }}
                  >
                    {e}
                  </Button>
                ))}
              </Box>
            </Popover>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CampaignIcon color="primary" />
              <Typography color="primary" fontSize={14}>
                Promote
              </Typography>
            </Stack>
          </Stack>

          {/* Image preview */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginLeft: 8 }}
            />
          )}

          {/* Post Button */}
          <Button
            variant="contained"
            disabled={!text && !imageUrl}
            onClick={handlePost}
            sx={{ borderRadius: 5, px: 3 }}
          >
            Post
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreatePost;

import React, { useState } from "react";
import Button from "./Button";
import "../styles/EventModal.scss";
import baseURL from "../baseURL";

const PostModal = ({ onClose, onPostCreated, editingPost, onPostUpdated }) => {
  const [formData, setFormData] = useState({
    title: editingPost?.title || "",
    body: editingPost?.body || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("body", formData.body);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = editingPost
        ? `${baseURL}/info/edit_post.php`
        : `${baseURL}/info/create_post.php`;

      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: editingPost
          ? JSON.stringify({ ...formData, id: editingPost.id })
          : formDataToSend,
      });

      if (response.ok) {
        const post = await response.json();
        if (editingPost) {
          onPostUpdated(post);
        } else {
          onPostCreated(post);
        }
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while submitting the post.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingPost ? "Edit Post" : "Create a New Post"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Body:
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </label>
          <div
            className={`drag-drop-area ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imageFile ? (
              <p>Image Selected: {imageFile.name}</p>
            ) : (
              <p>Drag and drop an image here, or click to select one.</p>
            )}
          </div>
          <div className="button-group">
            <Button type="button" variant="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="neutral">
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
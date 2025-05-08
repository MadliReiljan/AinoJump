import React, { useState, useRef } from "react";
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
  const fileInputRef = useRef(null);

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
  
  // New handler for file input changes
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else if (file) {
      alert("Please select a valid image file.");
    }
  };
  
  // New handler for clicking on the drop area
  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("body", formData.body);
      
      // If editing, include the post ID
      if (editingPost) {
        formDataToSend.append("id", editingPost.id);
        // Add _method parameter to simulate PUT request
        formDataToSend.append("_method", "PUT");
        console.log("Editing post with ID:", editingPost.id);
      }
      
      // Add the image file if one was selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
        console.log("Image attached:", imageFile.name);
      }
  
      // Always use POST for FormData to ensure proper processing
      const url = editingPost
        ? `${baseURL}/info/edit_post.php`
        : `${baseURL}/info/create_post.php`;
      
      console.log("Submitting to:", url, "with method:", editingPost ? "POST (simulating PUT)" : "POST");
      console.log("Form data contains ID:", formDataToSend.has("id"));
      console.log("Form data contains title:", formDataToSend.has("title"));
      console.log("Form data contains body:", formDataToSend.has("body"));
  
      const response = await fetch(url, {
        method: "POST", // Always use POST for FormData
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend
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
        console.error("Server responded with error:", errorData);
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
            onClick={handleAreaClick}
          >
            {imageFile ? (
              <p>Image Selected: {imageFile.name}</p>
            ) : (
              <p>Drag and drop an image here, or click to select one.</p>
            )}
          </div>
          {/* Hidden file input */}
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            accept="image/*"
          />
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
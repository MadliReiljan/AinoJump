import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import ModalMessage from "./ModalMessage";
import "../styles/EventModal.scss";
import baseURL from "../baseURL";

const PostModal = ({ onClose, onPostCreated, editingPost, onPostUpdated, resetEditingPost }) => {
  const [formData, setFormData] = useState({
    title: editingPost?.title || "",
    body: editingPost?.body || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      title: editingPost?.title || "",
      body: editingPost?.body || "",
    });
    setImageFile(null);
    setRemoveImage(false);
  }, [editingPost]);

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
      setModal({ open: true, title: 'Viga', message: 'Palun lohista siia sobiv pildifail.', onClose: () => setModal(m => ({ ...m, open: false })) });
    }
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else if (file) {
      setModal({ open: true, title: 'Viga', message: 'Palun vali sobiv pildifail.', onClose: () => setModal(m => ({ ...m, open: false })) });
    }
  };
  
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
      
      if (editingPost) {
        formDataToSend.append("id", editingPost.id);
        formDataToSend.append("_method", "PUT");
      }
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (removeImage) {
        formDataToSend.append("remove_image", "1");
      }

      const url = editingPost
        ? `${baseURL}/info/edit_post.php`
        : `${baseURL}/info/create_post.php`;
      
  
      const response = await fetch(url, {
        method: "POST", 
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
        setModal({ open: true, title: 'Õnnestus', message: 'Postitus edukalt loodud/muudetud!', onClose: () => setModal(m => ({ ...m, open: false })) });
        onClose();
      } else {
        const errorData = await response.json();
        setModal({ open: true, title: 'Viga', message: `Viga: ${errorData.message}`, onClose: () => setModal(m => ({ ...m, open: false })) });
      }
    } catch (error) {
      setModal({ open: true, title: 'Viga', message: 'Postituse saatmisel tekkis viga.', onClose: () => setModal(m => ({ ...m, open: false })) });
    }
  };

  const handleClose = () => {
    if (typeof resetEditingPost === 'function') {
      resetEditingPost();
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingPost ? "Muuda postitust" : "Loo uus postitus"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Pealkiri:</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <p>Sisu:</p>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </label>

          {editingPost?.image_url && !removeImage && !imageFile && (
            <div className="current-image-container">
              <img 
                src={`${baseURL}${editingPost.image_url}`} 
                alt="Current" 
                className="current-image-preview" 
              />
              <button 
                type="button" 
                onClick={() => setRemoveImage(true)} 
                className="remove-image"
              >
                Eemalda pilt
              </button>
            </div>
          )}

          <div
            className={`drag-drop-area ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleAreaClick}
          >
            {imageFile ? (
              <p>Pilt valitud: {imageFile.name}</p>
            ) : (
              <p>Lohista siia pilt või klõpsa pildi valimiseks.</p>
            )}
          </div>
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            accept="image/*"
          />
          <div className="post-actions">
            <button 
              type="submit" 
              className="post-edit-button"
            >
              {editingPost ? "Uuenda postitus" : "Loo postitus"}
            </button>
            <button 
              type="button" 
              onClick={handleClose} 
              className="post-delete-button"
            >
              Loobu
            </button>
          </div>
        </form>
      </div>
      {modal.open && (
        <ModalMessage
          open={modal.open}
          title={modal.title}
          message={modal.message}
          onClose={modal.onClose}
        />
      )}
    </div>
  );
};

export default PostModal;
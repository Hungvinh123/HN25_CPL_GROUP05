import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NewArticle.css";

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagList, setTagList] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tagsArray = tagList.split(" ").filter((tag) => tag.trim() !== "");

    const articleData = {
      article: {
        title,
        description,
        body,
        tagList: tagsArray,
      },
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to create an article.");
      }

      const response = await axios.post(
        "https://node-express-conduit.appspot.com/api/articles",
        articleData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const slug = response.data.article.slug;
      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.errors || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setBody("");
    setTagList("");
    setError(null);
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>Create New Article</h2>
        {error && (
          <div className="error-message">
            {typeof error === "object"
              ? Object.entries(error).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))
              : <p>{error}</p>}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="What's this article about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your article (in markdown or HTML)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows="8"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter tags (separated by spaces)"
              value={tagList}
              onChange={(e) => setTagList(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewArticle;
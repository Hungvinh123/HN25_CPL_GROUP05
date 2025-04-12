// NewArticle.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NewArticle.css";
import Header from "../pages/Header";
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

      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.errors || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
    <Header />
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold">Create New Article</h1>
            <p className="text-muted">Share your thoughts with the world</p>
          </div>

          <div className="card shadow-sm p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                {typeof error === "object"
                  ? Object.entries(error).map(([key, value]) => (
                      <p key={key} className="mb-0">{`${key}: ${value}`}</p>
                    ))
                  : <p className="mb-0">{error}</p>}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="form-label fw-semibold">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control form-control-lg"
                  placeholder="Enter your article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  placeholder="What's this article about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="body" className="form-label fw-semibold">
                  Content
                </label>
                <textarea
                  id="body"
                  className="form-control"
                  placeholder="Write your article (supports markdown)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows="8"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="form-label fw-semibold">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  className="form-control"
                  placeholder="Enter tags (space-separated)"
                  value={tagList}
                  onChange={(e) => setTagList(e.target.value)}
                />
                <div className="form-text">Separate tags with spaces</div>
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Publishing...
                    </>
                  ) : (
                    "Publish Article"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewArticle;
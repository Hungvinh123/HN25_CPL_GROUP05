import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
import "./EditArticlePage.css";

const EditArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch article data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to edit articles.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://node-express-conduit.appspot.com/api/articles/${slug}`
        );
        const { title, description, body, tagList } = response.data.article;
        setFormData({
          title,
          description: description || "",
          body,
          tagList: tagList?.join(", ") || "",
        });
      } catch (err) {
        setError("Unable to load article. Please try again later.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to update articles.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!formData.title || !formData.body) {
      setError("Title and content are required!");
      return;
    }

    const tags = formData.tagList
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      setSubmitting(true);
      setError(null);
      const response = await axios.put(
        `https://node-express-conduit.appspot.com/api/articles/${slug}`,
        {
          article: {
            title: formData.title,
            description: formData.description,
            body: formData.body,
            tagList: tags,
          },
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      navigate(`/article/${response.data.article.slug}`);
    } catch (err) {
      setError("Failed to update article. Please try again.");
      console.error("Error updating article:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container edit-article-container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <h1 className="edit-article-title">Edit Your Article</h1>
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="edit-article-form">
              <div className="mb-4">
                <label htmlFor="title" className="form-label">
                  Article Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Short Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  placeholder="Write a brief description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="body" className="form-label">
                  Content
                </label>
                <textarea
                  id="body"
                  name="body"
                  className="form-control"
                  rows="10"
                  placeholder="Write your article content here"
                  value={formData.body}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tagList" className="form-label">
                  Tags
                </label>
                <input
                  type="text"
                  id="tagList"
                  name="tagList"
                  className="form-control"
                  placeholder="Enter tags (separated by commas)"
                  value={formData.tagList}
                  onChange={handleChange}
                />
                <small className="form-text text-muted">
                  Example: technology, coding, react
                </small>
              </div>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Article"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditArticlePage;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
import "./MyArticles.css";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [message, setMessage] = useState(null);
  const username = localStorage.getItem("username");

  // Custom hook to fetch articles
  const fetchArticles = async () => {
    if (!username) {
      setMessage("Please log in to view your articles!");
      setTimeout(() => setMessage(null), 3000);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://node-express-conduit.appspot.com/api/articles?author=${username}`
      );
      setArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setMessage("Failed to load articles. Please try again!");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [username]);

  // Handle delete button click
  const handleDeleteClick = (slug) => {
    setSelectedSlug(slug);
    setShowModal(true);
  };

  // Handle article deletion
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to delete articles!");
      setShowModal(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      await axios.delete(
        `https://node-express-conduit.appspot.com/api/articles/${selectedSlug}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setArticles(articles.filter((article) => article.slug !== selectedSlug));
      setMessage("Article deleted successfully!");
      setShowModal(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting article:", error);
      setMessage("Failed to delete article!");
      setShowModal(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlug(null);
  };

  // Show loading spinner
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
      <div className="container py-5 position-relative">
        <div className="text-center mb-5 mt-5 banner">
          <h1 className="display-5 fw-bold">{username}'s Articles</h1>
          <p className="text-muted lead">A place to share your knowledge</p>
        </div>
        <hr />

        {/* Notification */}
        {message && (
          <div
            className={`alert ${
              message.includes("success") ? "alert-success" : "alert-danger"
            } alert-dismissible fade show shadow-lg fixed-alert`}
            role="alert"
          >
            <i
              className={`bi ${
                message.includes("success")
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-circle-fill"
              } me-2`}
            ></i>
            <strong>{message.includes("success") ? "Success!" : "Error!"}</strong>{" "}
            {message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Article list or empty state */}
        {articles.length === 0 ? (
          <div className="alert alert-info text-center shadow-sm" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            No articles yet.{" "}
            <Link to="/editor" className="alert-link">
              Write one!
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {articles.map((article) => (
              <div key={article.slug} className="col">
                <div className="card h-100 shadow-sm article-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-3">
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        {article.title}
                      </Link>
                    </h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-person-circle me-1"></i>
                      {article.author.username} •{" "}
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="card-text flex-grow-1">
                      {article.description?.substring(0, 150) ||
                        "No description available."}
                      {article.description?.length > 150 && "..."}
                    </p>
                    {/* Tags */}
                    {article.tagList?.length > 0 && (
                      <div className="mb-3">
                        {article.tagList.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-primary-subtle text-primary me-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-auto">
                      <Link to={`/editor/${article.slug}`}>
                        <button className="btn btn-outline-success btn-sm">
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteClick(article.slug)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex="-1"
          style={{ display: showModal ? "block" : "none" }}
          aria-labelledby="deleteModalLabel"
          aria-hidden={!showModal}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold" id="deleteModalLabel">
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this article? This action cannot be
                undone.
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
};

export default MyArticles;
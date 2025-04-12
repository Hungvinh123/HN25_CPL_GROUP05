import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
import "./MyArticles.css"; // CSS tùy chỉnh

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesResponse = await axios.get(
          `https://node-express-conduit.appspot.com/api/articles?author=${username}`
        );
        setArticles(articlesResponse.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [username]);

  const handleDeleteClick = (slug) => {
    setSelectedSlug(slug);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://node-express-conduit.appspot.com/api/articles/${selectedSlug}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      setArticles(articles.filter((article) => article.slug !== selectedSlug));
      setSuccessMessage("Xóa bài viết thành công!");
      setShowModal(false);
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      setSuccessMessage("Lỗi khi xóa bài viết!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlug(null);
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5 position-relative">
        <div className="text-center mb-5 mt-5 banner">
          <h1 className="display-5 fw-bold">Bài viết của {username}</h1>
          <p className="text-muted lead">
            Khám phá những câu chuyện bạn đã chia sẻ
          </p>
        </div>
        <hr />

        {/* Thông báo xóa thành công hoặc lỗi */}
        {successMessage && (
          <div
            className={`alert ${
              successMessage.includes("thành công")
                ? "alert-success"
                : "alert-danger"
            } alert-dismissible fade show shadow-lg fixed-alert`}
            role="alert"
          >
            <i
              className={`bi ${
                successMessage.includes("thành công")
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-circle-fill"
              } me-2`}
            ></i>
            <strong>
              {successMessage.includes("thành công") ? "Thành công!" : "Lỗi!"}
            </strong>{" "}
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="alert alert-info text-center shadow-sm" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            Bạn chưa có bài viết nào.{" "}
            <Link to="/editor" className="alert-link">
              Tạo bài viết ngay!
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
                      {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="card-text flex-grow-1">
                      {article.description?.substring(0, 150) ||
                        "Không có mô tả."}
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
                          <i className="bi bi-pencil-square me-1"></i> Cập nhật
                        </button>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteClick(article.slug)}
                      >
                        <i className="bi bi-trash me-1"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal xác nhận xóa */}
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
                  Xác nhận xóa bài viết
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn
                  tác.
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Backdrop cho modal */}
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
};

export default MyArticles;
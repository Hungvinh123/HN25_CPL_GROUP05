import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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
          description: description || "", // Nếu API không trả về description, mặc định là chuỗi rỗng
          body,
          tagList: tagList.join(", "),
        });
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
        console.error("Error fetching article:", err);
      }
    };

    fetchArticle();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.title || !formData.body) {
      setError("Tiêu đề và nội dung không được để trống!");
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
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      navigate(`/article/${response.data.article.slug}`);
    } catch (err) {
      setError("Có lỗi khi cập nhật bài viết. Vui lòng thử lại.");
      console.error("Error editing article:", err);
    } finally {
      setSubmitting(false);
    }
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="text-center mb-4">Chỉnh sửa bài viết</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Tiêu đề bài viết"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Mô tả bài viết"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="body"
                  rows="8"
                  placeholder="Nội dung bài viết"
                  value={formData.body}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="tagList"
                  placeholder="Thẻ (cách nhau bằng dấu phẩy)"
                  value={formData.tagList}
                  onChange={handleChange}
                />
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật bài viết"
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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../pages/Header";
const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (slug) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await axios.delete(
          `https://node-express-conduit.appspot.com/api/articles/${slug}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        // Cập nhật danh sách bài viết sau khi xóa
        setArticles(articles.filter((article) => article.slug !== slug));
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      }
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
      <h3 className="mb-4 text-center">Bài viết của {username}</h3>
      {articles.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Không tìm thấy bài viết nào.
        </div>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div key={article.slug} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/article/${article.slug}`} className="text-primary">
                      {article.title}
                    </Link>
                  </h5>
                  <p className="card-text text-muted">
                    Bởi {article.author.username} vào ngày{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    {article.description || "Không có mô tả."}
                  </p>
                  <div className="d-flex gap-2">
                    <Link to={`/editor/${article.slug}`}>
                      <button className="btn btn-success btn-sm">Cập nhật</button>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(article.slug)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MyArticles;
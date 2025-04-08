import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// CSS tùy chỉnh
const styles = `
  .article-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
  }
  .article-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #333;
  }
  .article-meta {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 20px;
  }
  .article-description {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 20px;
    font-style: italic;
  }
  .article-body {
    font-size: 1rem;
    line-height: 1.6;
    color: #444;
    margin-bottom: 30px;
  }
  .back-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  .back-button:hover {
    background-color: #0056b3;
    color: #fff;
  }
`;

const ArticleDetail = () => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams(); // Lấy slug từ URL

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://node-express-conduit.appspot.com/api/articles/${slug}`
                );
                setArticle(response.data.article); // Lưu thông tin bài viết
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bài viết:", error);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]); // Chạy lại khi slug thay đổi

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!article) {
        return <div>Không tìm thấy bài viết!</div>;
    }

    return (
        <>
            {/* Thêm CSS tùy chỉnh vào trang */}
            <style>{styles}</style>
            <div className="article-detail">
                <h1 className="article-title">{article.title}</h1>
                <p className="article-meta">
                    Bởi {article.author.username} vào ngày{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                </p>
                {article.description && (
                    <p className="article-description">{article.description}</p>
                )}
                <div className="article-body">
                    <p>{article.body}</p> {/* Hiển thị nội dung đầy đủ của bài viết */}
                </div>
                <ul>
                    {article.tagList.map((tag, index) => (
                        <li key={index} className="badge bg-primary mr-2">{tag}</li>
                    ))}
                </ul>
                <Link to={`/article-user`} className="back-button">
                    Quay lại danh sách bài viết
                </Link>
            </div>
        </>
    );
};

export default ArticleDetail;
// Home.js
import React from "react";
import "./Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../pages/Header"; // Import Header component
import { Link } from "react-router-dom";
const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tag, setTag] = useState("");

  const getArticles = async () => {
    try {
      const response = await axios.get(
        `https://node-express-conduit.appspot.com/api/articles?limit=200&offset=0${tag && `&tag=${tag}`
        }`
      );
      if (response.status === 200) {
        setArticles(response.data.articles);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getArticles();
  }, [tag]);

  const handleFavorite = async (slug) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Khong co token");
        return;
      }
      const response = await axios.post(
        `https://node-express-conduit.appspot.com/api/articles/${slug}/favorite`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const newArticles = articles.map((article) => {
          if (article?.slug === slug) {
            return {
              ...article,
              favorited: !article.favorited,
              favoritesCount: article.favoritesCount + (article.favorited ? -1 : 1),
            };
          }
          return article;
        });
        setArticles(newArticles);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Header /> {/* Sử dụng Header component */}
      <div className="banner">
        <h1>conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
      <div className="home-container">
        <div className="feed-navigation">
          <button className="feed-btn">Your Feed</button>
          <button className="feed-btn active">Global Feed</button>
        </div>

        <div className="content-wrapper">
          <main className="articles-section">
            {articles.length > 0
              ? articles?.map((article) => (
                <article className="article-card" key={article?.slug}>
                  <div className="article-meta">
                    <img src={article?.author?.image} alt="Author" className="author-image" />
                    <div className="author-info">
                      <p>{article?.author?.username}</p>
                      <span>
                        {new Date(article?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div
                      className={`article-favorite ${article?.favorited ? "favorited  " : ""}`}
                      onClick={() => handleFavorite(article?.slug)}
                    >
                      {article?.favoritesCount}
                    </div>
                  </div>
                  <div className="article-content">
                    <h2>{article?.title}</h2>
                    <p>{article?.description}</p>

                    {/* Nút "Read more" */}
                    <Link
                      to={`/article/${article.slug}`}
                      style={{ color: "#5CB85C", cursor: "pointer", textDecoration: "none" }}
                    >
                      Read more...
                    </Link>
                  </div>
                </article>
              ))
              : "Đang tải dữ liệu"}
          </main>

          <aside className="sidebar">
            <div className="popular-tags">
              <h3>Popular Tags</h3>
              <div className="tags-container">
                <span className="tag">programming</span>
                <span className="tag">javascript</span>
                <span className="tag">angularjs</span>
                <span className="tag">react</span>
                <span className="tag">mean</span>
                <span className="tag">node</span>
                <span className="tag">rails</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Home;
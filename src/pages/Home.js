import React from "react";
import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //new import
import axios from "axios";
import Header from "../pages/Header"; 

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFeed, setActiveFeed] = useState("global");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); //new import
  const limit = 10;
  const tagLimit = 30;


  const getArticles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = "https://node-express-conduit.appspot.com/api";
      const endpoint = activeFeed === "private" ? "/articles/feed" : "/articles";

      const response = await axios.get(
        `${baseUrl}${endpoint}?limit=${limit}&offset=${(page - 1) * 10}${tag && `&tag=${tag}`}`,
        token && activeFeed === "private"
          ? {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          : {}
      );

      if (response.status === 200) {
        const sortedArticles = response.data.articles.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt));
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.articlesCount / limit));
      }
    } catch (e) {
      console.log(e);
      setArticles([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };


  const getTags = async () => {
    try {
      const response = await axios.get("https://node-express-conduit.appspot.com/api/tags");
      if (response.status === 200) {
        setTags(response.data.tags);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    setTotalPages(0);
    getArticles();
  }, [tag, page, activeFeed]);

  console.log(totalPages);

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
    <Header />
      <div className="banner">
        <h1>conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
      <div className="home-container">
        <div className="feed-navigation">
          <button
            className={`feed-btn ${activeFeed === "private" ? "active" : ""}`}
            onClick={() => {
              setActiveFeed("private");
              setTag("");
              setPage(1);
            }}
          >
            Your Feed
          </button>
          <button
            className={`feed-btn ${activeFeed === "global" ? "active" : ""}`}
            onClick={() => {
              setActiveFeed("global");
              setTag("");
              setPage(1);
            }}
          >
            Global Feed
          </button>
          {tag && <button className="feed-btn active">{tag}</button>}
        </div>
        <div className="content-wrapper">
          <main className="articles-section">
            {isLoading ? (
              <div>Đang tải bài viết...</div>
            ) : articles.length > 0 ? (
              articles?.map((article) => (
                <article className="article-card" key={article?.slug}>
                  <div className="article-meta">
                  <img src={article?.author?.image} alt="Author" className="author-image"
                      onClick={() => navigate(`/profiles/${article?.author?.username}`)} />
                    <div className="author-info">
                    <p onClick={() => navigate(`/profiles/${article?.author?.username}`)}>
                    {article?.author?.username}</p>
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
                    <a href="#" className="read-more">
                      Read more...
                    </a>
                  </div>
                </article>
              ))
            ) : (
              "Không có bài viết nào"
            )}
          </main>

          <aside className="sidebar">
            <div className="popular-tags">
              <h3>Popular Tags</h3>
              <div className="tags-container">
                {tags.length > 0 &&
                  tags?.map(
                    (tag, index) =>
                      index <= tagLimit && (
                        <span
                          className="tag"
                          onClick={() => {
                            setTag(tag);
                            setPage(1);
                            setActiveFeed("");
                          }}
                          key={index}
                        >
                          {tag}
                        </span>
                      )
                  )}
              </div>
            </div>
          </aside>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

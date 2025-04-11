// ArticleDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { postComment } from "./PostComment";
import { postReply } from "./PostReply";
import { groupComments } from "./GroupComments";
import { RenderComments } from "./RenderComments";
import Header from "./Header";

const BASE_API = "https://node-express-conduit.appspot.com/api";

const ArticleDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [userToken, setUserToken] = useState(localStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("username"));
    const [hoveredComment, setHoveredComment] = useState(null);

    useEffect(() => {
        fetch(`${BASE_API}/articles/${slug}`)
            .then(res => res.json())
            .then(data => setArticle(data.article))
            .catch(err => console.error("Error fetching article:", err));

        fetch(`${BASE_API}/articles/${slug}/comments`)
            .then(res => res.json())
            .then(data => setComments(data.comments))
            .catch(err => console.error("Error fetching comments:", err));
    }, [slug]);

    useEffect(() => {
        setUserToken(localStorage.getItem("token"));
        setCurrentUser(localStorage.getItem("username"));
    }, [location]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!userToken) {
            navigate("/login", { state: { returnUrl: `/article/${slug}` } });
            return;
        }

        try {
            await postComment({ slug, comment, userToken, setComments, setComment, comments });
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            await postReply({ slug, replyText, parentId, comments, userToken, setComments, setReplyText, setReplyingTo });
        } catch (err) {
            console.error("Error posting reply:", err);
        }
    };

    if (!article) return <p>Loading article...</p>;

    const { roots, map: childrenMap } = groupComments(comments);

    return (
        <>
            <div>
                <Header />
            </div>
            <div className="banner">
                <h1>conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>



            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <img
                    src={article.author.image}
                    alt={article.author.username}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                    }}
                />
                <div>
                    <strong style={{ color: "#5CB85C" }}>{article.author.username}</strong>
                    <p style={{ margin: 0, fontSize: "12px", color: "#bbb" }}>
                        {new Date(article.createdAt).toDateString()}
                    </p>
                </div>
            </div>
            <div style={{ paddingBottom: "20px", borderBottom: "1px solid #ccc" }}>
                <h1>{article.title}</h1>
                <p>{article.description}</p>
                <p>{article.body}</p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Bình luận</h3>

                {userToken ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Thêm bình luận..."
                            style={{
                                width: "100%",
                                height: "60px",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd"
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                marginTop: "10px",
                                padding: "10px 15px",
                                backgroundColor: "#5CB85C",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Đăng
                        </button>
                    </form>
                ) : (
                    <p><Link to="/login" state={{ returnUrl: `/article/${slug}` }}>Đăng nhập</Link> để bình luận.</p>
                )}

                {roots.length > 0 ? (
                    roots.map(comment => (
                        <RenderComments
                            key={comment.id}
                            comment={comment}
                            level={0}
                            childrenMap={childrenMap}
                            currentUser={currentUser}
                            userToken={userToken}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            handleReplySubmit={handleReplySubmit}
                            setHoveredComment={setHoveredComment}
                            hoveredComment={hoveredComment}
                            slug={slug}
                            comments={comments}
                            setComments={setComments}
                        />
                    ))
                ) : (
                    <p>Chưa có bình luận nào.</p>
                )}
            </div>
        </>
    );
};

export default ArticleDetail;

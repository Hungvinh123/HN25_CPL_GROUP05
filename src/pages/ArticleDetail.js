import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { postComment } from "./PostComment";
import { postReply } from "./PostReply";
import { groupComments } from "./GroupComments";
import { RenderComments } from "./RenderComments";
import Header from "./Header";
import parse from "html-react-parser";
import "./ArticleDetail.css"; // Import CSS đã sửa

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
            .then((res) => res.json())
            .then((data) => setArticle(data.article))
            .catch((err) => console.error("Error fetching article:", err));

        fetch(`${BASE_API}/articles/${slug}/comments`)
            .then((res) => res.json())
            .then((data) => setComments(data.comments))
            .catch((err) => console.error("Error fetching comments:", err));
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
            await postReply({
                slug,
                replyText,
                parentId,
                comments,
                userToken,
                setComments,
                setReplyText,
                setReplyingTo,
            });
        } catch (err) {
            console.error("Error posting reply:", err);
        }
    };

    if (!article) return <p className="article-detail-no-comments">Loading article...</p>;

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

            <div className="article-detail-container">
                <div className="article-detail-author-info" >
                    <img src={article.author.image} alt={article.author.username}  onClick={() => navigate(`/profiles/${article?.author?.username}`)}/>
                    <div>
                        <strong  onClick={() => navigate(`/profiles/${article?.author?.username}`)}>{article.author.username}</strong>
                        <p>{new Date(article.createdAt).toDateString()}</p>
                    </div>
                </div>

                <div className="article-detail-content">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <div>{parse(article.body)}</div>
                </div>

                <div className="article-detail-comments-section">
                    <h3>Comments</h3>

                    {userToken ? (
                        <form onSubmit={handleCommentSubmit} className="article-detail-comment-form">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button type="submit">Comment</button>
                        </form>
                    ) : (
                        <p className="article-detail-login-prompt">
                            <Link to="/login" state={{ returnUrl: `/article/${slug}` }}>
                                Login
                            </Link>{" "}
                            to comment.
                        </p>
                    )}

                    {roots.length > 0 ? (
                        roots.map((comment) => (
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
                        <p className="article-detail-no-comments">No comments yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ArticleDetail;
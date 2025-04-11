// RenderComments.js
import React from "react";
import { handleDeleteComment } from "./DeleteComment";

export const RenderComments = ({
    comment,
    level,
    childrenMap,
    currentUser,
    userToken,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    handleReplySubmit,
    setHoveredComment,
    hoveredComment,
    slug,
    comments,
    setComments,
}) => {
    const renderContent = (text) => {
        const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;
        return text.split(imageRegex).map((part, index) => {
            if (part.match(imageRegex)) {
                return <img key={index} src={part} alt="img" style={{ maxWidth: "50%", marginTop: "8px" }} />;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div
            key={comment.id}
            style={{
                marginLeft: `${level * 20}px`,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                position: "relative"
            }}
            onMouseEnter={() => setHoveredComment(comment.id)}
            onMouseLeave={() => setHoveredComment(null)}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <img
                    src={comment.author.image}
                    alt={comment.author.username}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px" }}
                />
                <div style={{ flexGrow: 1 }}>
                    <strong>{comment.author.username}</strong>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                {currentUser && comment.author.username === currentUser && hoveredComment === comment.id && (
                    <button
                        onClick={() => handleDeleteComment({ commentId: comment.id, author: comment.author.username, currentUser, userToken, slug, comments, setComments })}
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            color: "red",
                        }}
                    >
                        Xóa
                    </button>
                )}
            </div>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{renderContent(comment.body)}</p>

            {userToken && (
                <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    style={{
                        fontSize: "12px",
                        color: "#5CB85C",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "8px"
                    }}
                >
                    {replyingTo === comment.id ? "Hủy" : "Trả lời"}
                </button>
            )}

            {replyingTo === comment.id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} style={{ marginTop: "10px" }}>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết phản hồi..."
                        style={{ width: "100%", height: "50px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button
                        type="submit"
                        style={{
                            marginTop: "6px",
                            padding: "6px 12px",
                            backgroundColor: "#5CB85C",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Gửi phản hồi
                    </button>
                </form>
            )}

            {childrenMap[comment.id]?.map(child => (
                <RenderComments
                    key={child.id}
                    comment={child}
                    level={level + 1}
                    childrenMap={childrenMap}
                    {...{
                        currentUser,
                        userToken,
                        replyingTo,
                        setReplyingTo,
                        replyText,
                        setReplyText,
                        handleReplySubmit,
                        setHoveredComment,
                        hoveredComment,
                        slug,
                        comments,
                        setComments
                    }}
                />
            ))}
        </div>
    );
};

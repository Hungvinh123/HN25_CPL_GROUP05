// DeleteComment.js
import axios from "axios";

export const handleDeleteComment = async ({ commentId, author, currentUser, userToken, slug, comments, setComments }) => {
    if (author !== currentUser) return;

    try {
        await axios.delete(`https://node-express-conduit.appspot.com/api/articles/${slug}/comments/${commentId}`, {
            headers: { Authorization: `Token ${userToken}` },
        });
        setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
};

// PostReply.js
import axios from "axios";

export const postReply = async ({ slug, replyText, parentId, comments, userToken, setComments, setReplyText, setReplyingTo }) => {
    const parentComment = comments.find(c => c.id === parentId);
    const bodyWithMention = `@${parentComment?.author.username}: ${replyText}`;

    const response = await axios.post(
        `https://node-express-conduit.appspot.com/api/articles/${slug}/comments`,
        { comment: { body: bodyWithMention } },
        { headers: { Authorization: `Token ${userToken}` } }
    );

    setComments([response.data.comment, ...comments]);
    setReplyText("");
    setReplyingTo(null);
};

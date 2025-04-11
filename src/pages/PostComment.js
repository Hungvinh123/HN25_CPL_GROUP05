// PostComment.js
import axios from "axios";

export const postComment = async ({ slug, comment, userToken, setComments, setComment, comments }) => {
    const response = await axios.post(
        `https://node-express-conduit.appspot.com/api/articles/${slug}/comments`,
        { comment: { body: comment } },
        { headers: { Authorization: `Token ${userToken}` } }
    );
    setComments([response.data.comment, ...comments]);
    setComment("");
};

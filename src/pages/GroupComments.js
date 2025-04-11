// GroupComments.js
export const groupComments = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach(comment => {
        const match = comment.body.match(/^@\w+:/);
        if (match) {
            const mentionedUsername = match[0].slice(1, -1);
            const parent = comments.find(c => c.author.username === mentionedUsername);
            if (parent) {
                if (!map[parent.id]) map[parent.id] = [];
                map[parent.id].push(comment);
            } else {
                roots.push(comment);
            }
        } else {
            roots.push(comment);
        }
    });

    return { roots, map };
};

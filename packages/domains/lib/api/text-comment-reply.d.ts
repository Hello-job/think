export declare const TextCommentReplyApiDefinition: {
    /**
     * 文本评论回复
     */
    create: {
        method: "post";
        server: "create";
        client: () => string;
    };
    /**
     * 获取文本全回复
     */
    getTextCommentReply: {
        method: "get";
        server: "/";
        client: () => string;
    };
    /**
     * 删除评论回复
     */
    deleteTextCommentReply: {
        method: "delete";
        server: string;
        client: () => string;
    };
    /**
     * 修改评论
     */
    editTextCommentReply: {
        method: "post";
        server: string;
        client: () => string;
    };
};

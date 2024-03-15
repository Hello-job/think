export declare const TextCommentApiDefinition: {
    /**
     * 新建选中文本
     */
    create: {
        method: "post";
        server: "create";
        client: () => string;
    };
    /**
     * 获取文档文本评论
     */
    getTextComment: {
        method: "get";
        server: "/";
        client: () => string;
    };
    /**
     * 删除文本评论
     */
    deleteTextComment: {
        method: "delete";
        server: "delete";
        client: () => string;
    };
};

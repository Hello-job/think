"use strict";
exports.__esModule = true;
exports.TextCommentReplyApiDefinition = void 0;
exports.TextCommentReplyApiDefinition = {
    /**
     * 文本评论回复
     */
    create: {
        method: 'post',
        server: 'create',
        client: function () { return '/text-comment-reply/create'; }
    },
    /**
     * 获取文本全回复
     */
    getTextCommentReply: {
        method: 'get',
        server: '/',
        client: function () { return '/text-comment-reply'; }
    },
    /**
     * 删除评论回复
     */
    deleteTextCommentReply: {
        method: 'delete',
        server: 'delete',
        client: function () { return '/text-comment-reply/delete'; }
    },
    /**
     * 修改评论
     */
    editTextCommentReply: {
        method: 'post',
        server: 'edit',
        client: function () { return '/text-comment-reply/edit'; }
    }
};

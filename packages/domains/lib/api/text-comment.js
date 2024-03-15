"use strict";
exports.__esModule = true;
exports.TextCommentApiDefinition = void 0;
exports.TextCommentApiDefinition = {
    /**
     * 新建选中文本
     */
    create: {
        method: 'post',
        server: 'create',
        client: function () { return '/text-comment/create'; }
    },
    /**
     * 获取文档文本评论
     */
    getTextComment: {
        method: 'get',
        server: '/',
        client: function () { return '/text-comment'; }
    },
    /**
     * 删除文本评论
     */
    deleteTextComment: {
        method: 'delete',
        server: 'delete',
        client: function () { return '/text-comment/delete'; }
    }
};

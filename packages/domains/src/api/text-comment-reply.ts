import { IComment, IDocument } from '../models';

export const TextCommentReplyApiDefinition = {
  /**
   * 文本评论回复
   */
  create: {
    method: 'post' as const,
    server: 'create' as const,
    client: () => '/text-comment-reply/create',
  },
  /**
   * 获取文本全回复
   */
  getTextCommentReply: {
    method: 'get' as const,
    server: '/' as const,
    client: () => '/text-comment-reply',
  },
  /**
   * 删除评论回复
   */
  deleteTextCommentReply: {
    method: 'delete' as const,
    server: 'delete',
    client: () => '/text-comment-reply/delete',
  },

  /**
   * 修改评论
   */
  editTextCommentReply: {
    method: 'post' as const,
    server: 'edit',
    client: () => '/text-comment-reply/edit',
  },
};

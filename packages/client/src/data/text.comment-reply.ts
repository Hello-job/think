import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { TextCommentReplyApiDefinition } from '@think/domains';

import { HttpClient } from 'services/http-client';

export const useTextCommentReply = () => {
  // const { data, refetch } = useQuery([TextCommentReplyApiDefinition.getTextCommentReply.client()], () =>
  //   getTextCommentReply(textId)
  // );

  /**
   * 创建评论回复
   */
  const createTextCommentReply = useCallback(async (data) => {
    const ret = await HttpClient.request({
      method: TextCommentReplyApiDefinition.create.method,
      url: TextCommentReplyApiDefinition.create.client(),
      data,
    });
    return ret;
  }, []);

  /**
   * 编辑评论
   */
  const editTextCommentReply = useCallback(async (data) => {
    const ret = await HttpClient.request({
      method: TextCommentReplyApiDefinition.editTextCommentReply.method,
      url: TextCommentReplyApiDefinition.editTextCommentReply.client(),
      data,
    });
    return ret;
  }, []);

  /**
   * 删除评论
   */
  const deleteTextCommentReply = useCallback(async (id: string) => {
    const ret = await HttpClient.request({
      method: TextCommentReplyApiDefinition.deleteTextCommentReply.method,
      url: TextCommentReplyApiDefinition.deleteTextCommentReply.client(),
      params: {
        id,
      },
    });
  }, []);

  return {
    createTextCommentReply,
    editTextCommentReply,
    deleteTextCommentReply,
  };
};

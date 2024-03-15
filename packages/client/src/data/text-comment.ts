import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';

import { TextCommentApiDefinition } from '@think/domains';

import { HttpClient } from 'services/http-client';

/**
 * 获取文档会话列表
 * @param documentId
 * @returns
 */
const getTextComment = (documentId) => {
  return HttpClient.request({
    method: TextCommentApiDefinition.getTextComment.method,
    url: TextCommentApiDefinition.getTextComment.client(),
    params: {
      documentId,
    },
  });
};

export const useTextComment = (documentId) => {
  const { data, refetch } = useQuery(TextCommentApiDefinition.getTextComment.client(), () =>
    getTextComment(documentId)
  );

  useEffect(() => {
    refetch();
  }, [documentId, refetch]);

  /**
   * 创建文本回话
   */
  const createTextComment = useCallback(async (data) => {
    const ret = await HttpClient.request({
      method: TextCommentApiDefinition.create.method,
      url: TextCommentApiDefinition.create.client(),
      data,
    });
    return ret;
  }, []);

  /**
   * 删除文本会话
   */
  const deleteTextComment = useCallback(
    async (textId) => {
      const ret = await HttpClient.request({
        method: TextCommentApiDefinition.deleteTextComment.method,
        url: TextCommentApiDefinition.deleteTextComment.client(),
        params: {
          textId,
        },
      });
      refetch();
    },
    [refetch]
  );

  return {
    data,
    createTextComment,
    deleteTextComment,
    refetchTextComments: refetch,
  };
};

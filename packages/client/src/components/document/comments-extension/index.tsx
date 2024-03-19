import { useCallback, useEffect, useState } from 'react';

import { IconComment, IconDoubleChevronRight } from '@douyinfe/semi-icons';

import { ILoginUser } from '@think/domains';

import Comment from '@sereneinserenade/tiptap-comment-extension';
import { BubbleMenu } from '@tiptap/react';

import { useTextCommentReply } from 'data/text.comment-reply';
import { useTextComment } from 'data/text-comment';
import { useUser } from 'data/user';
import { v4 } from 'uuid';

import { TextConversation } from './text-conversation';

import styles from './index.module.scss';

interface Replies {
  id?: string;
  user: ILoginUser;
  content: string;
  createTime?: string;
}

interface Comment {
  id: string;
  textId?: string;
  replies: Replies[];
  createdAt: Date;
  text: string;
}

/**
 * 获取选中文本内容
 * @param id 选中文本id
 * @returns
 */
const getSelectText = (id) => {
  // 获取所有 class 为 "my-comment" 的元素
  const comments = document.getElementsByClassName('my-comment');
  let text = '';
  // 遍历所有元素，找到 data-comment-id 匹配的元素
  for (const comment of comments) {
    if ((comment as HTMLElement).dataset.commentId === id) {
      // 获取文本内容
      const textContent = comment.textContent;

      // 输出文本内容
      text = textContent;
      return textContent;
    }
  }
  return text;
};

export const CompentEditExtension = ({ editor, menubar, commentProps }) => {
  const {
    activeCommentId,
    foldStatus,
    setFoldStatus,
    setActiveCommentId,
    commentsSectionRef,
    focusCommentWithActiveId,
    documentId,
  } = commentProps;

  const { data = [], createTextComment, refetchTextComments } = useTextComment(documentId);
  const { createTextCommentReply, editTextCommentReply, deleteTextCommentReply } = useTextCommentReply();

  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);

  const getNewComment = (content: string, text = ''): Comment => {
    return {
      id: `a${v4()}a`,
      text,
      replies: [],
      createdAt: new Date(),
    };
  };

  useEffect(() => {
    setComments(data as Comment[]);
  }, [data]);

  useEffect(() => {
    if (!activeCommentId) return;
    focusCommentWithActiveId(activeCommentId);
  }, [activeCommentId, focusCommentWithActiveId]);

  useEffect(() => {
    // 获取所有 class 为 "my-comment" 的元素
    const comments = document.getElementsByClassName('my-comment');
    // 遍历所有元素，找到 data-comment-id 匹配的元素
    for (const comment of comments) {
      if ((comment as HTMLElement).dataset.commentId === activeCommentId) {
        // 获取文本内容
        (comment as HTMLElement).classList.add('my-comment-active');
      } else {
        (comment as HTMLElement).classList.remove('my-comment-active');
      }
    }
  }, [activeCommentId]);

  const defaultReplies = {
    user,
    content: '',
  };

  /**
   * 创建评论
   */
  const setComment = () => {
    const newComment = getNewComment('', '');

    editor?.commands.setComment(newComment.id);
    const text = getSelectText(newComment.id);

    newComment.text = text;
    const replies: Replies[] = [defaultReplies];
    newComment.replies = replies;
    setComments([...comments, newComment]);

    setActiveCommentId(newComment.id);

    setTimeout(focusCommentWithActiveId);
  };

  /**
   * 创建文本会话
   */
  const handleCreateTextConverses = useCallback(
    (data: { text: string; textId: string }) => {
      return createTextComment({ ...data, documentId });
    },
    [documentId, createTextComment]
  );

  /**
   * 创建文本评论
   */
  const handleCreateTextCommentReply = useCallback(
    ({ content, textId }) => {
      createTextCommentReply({ content, userId: user.id, textId }).then((res) => {
        refetchTextComments();
      });
    },
    [user.id, createTextCommentReply, refetchTextComments]
  );

  /**
   * 更改回复信息
   */
  const handleReplyChange = useCallback(
    async (data: { content: string; id: number }) => {
      const res = await editTextCommentReply(data);
      refetchTextComments();
      return res;
    },
    [editTextCommentReply, refetchTextComments]
  );

  /**
   * 删除单条评论
   */
  const handleDeleteReply = useCallback(
    async (id) => {
      await deleteTextCommentReply(id);
      refetchTextComments();
    },
    [deleteTextCommentReply, refetchTextComments]
  );

  return (
    <div className={styles.commentWrap} style={{ top: menubar ? '110px' : 0 }} ref={commentsSectionRef}>
      <div
        className={`${styles.open} ${!foldStatus && styles.tranformX40}`}
        onClick={() => {
          setFoldStatus(false);
        }}
      >
        <IconComment />
      </div>
      <div id="commentContent" className={`${styles.textComment} ${foldStatus && styles.tranformX295}`}>
        {editor && (
          <>
            <div className={styles.header}>
              <span>评论({comments.length})</span>
              <IconDoubleChevronRight
                key="commentIcon"
                className={styles.foldIcon}
                onClick={() => setFoldStatus(true)}
              />
            </div>
            <section className={`${styles.container} `}>
              {comments.length ? (
                comments.map((comment) => (
                  <TextConversation
                    key={comment.textId}
                    comment={comment}
                    activeCommentId={activeCommentId}
                    comments={comments}
                    setActiveCommentId={setActiveCommentId}
                    editor={editor}
                    setComments={setComments}
                    onCreateTextComment={handleCreateTextConverses}
                    onCreateCommentReply={handleCreateTextCommentReply}
                    onCommentChange={handleReplyChange}
                    onDeleteReply={handleDeleteReply}
                  />
                ))
              ) : (
                <span className={styles.notComment}>还没有频评论</span>
              )}
            </section>
          </>
        )}
      </div>
      <BubbleMenu editor={editor} className={styles.bubbleMenu}>
        <div className={styles.bubbleBtn} onClick={setComment}>
          评论
        </div>
      </BubbleMenu>
    </div>
  );
};

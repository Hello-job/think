import { Fragment, useEffect, useRef, useState } from 'react';

import { IconComment, IconDoubleChevronRight } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';

import { ILoginUser, IUser } from '@think/domains';

import Comment from '@sereneinserenade/tiptap-comment-extension';
import { BubbleMenu, EditorContent, JSONContent, useEditor } from '@tiptap/react';

import { useUser } from 'data/user';
import { v4 } from 'uuid';

import { CommentItem } from './item';

import styles from './index.module.scss';

interface Replies {
  id?: string;
  user: ILoginUser;
  content: string;
  createTime?: string;
}

interface Comment {
  id: string;
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

export const CompentEditExtension = ({ editor, commentProps }) => {
  const { activeCommentId, setActiveCommentId, commentsSectionRef, focusCommentWithActiveId } = commentProps;
  const { user } = useUser();
  const [foldStatus, setFoldStatus] = useState<boolean>(false);
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
    if (!activeCommentId) return;
    focusCommentWithActiveId(activeCommentId);
  }, [activeCommentId, focusCommentWithActiveId]);

  const defaultReplies = {
    user,
    content: '',
  };

  const setComment = (value) => {
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

  return (
    <div className={styles.commentWrap}>
      <div className={`${styles.open} ${!foldStatus && styles.tranformX40}`} onClick={() => setFoldStatus(false)}>
        <IconComment />
      </div>
      <div className={`${styles.textComment} ${foldStatus && styles.tranformX295}`}>
        {editor && (
          <>
            <div className={styles.header}>
              <span>评论({comments.length})</span>
              <IconDoubleChevronRight className={styles.foldIcon} onClick={() => setFoldStatus(true)} />
            </div>
            <section className={`${styles.container} `} ref={commentsSectionRef}>
              {comments.length ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    activeCommentId={activeCommentId}
                    comments={comments}
                    setComments={setComments}
                    setActiveCommentId={setActiveCommentId}
                    editor={editor}
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

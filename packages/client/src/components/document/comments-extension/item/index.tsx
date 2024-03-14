import { Fragment, useCallback, useMemo, useState } from 'react';

import { IconComment, IconMore } from '@douyinfe/semi-icons';
import { Dropdown, Tag } from '@douyinfe/semi-ui';
import { Button, Input } from '@douyinfe/semi-ui';

import { useUser } from 'data/user';
import { timeConverter } from 'helpers/url';

import { CommentInput } from '../comment-input';

import styles from './index.module.scss';
export const CommentItem = ({ comment, activeCommentId, comments, setComments, setActiveCommentId, editor }) => {
  const { user } = useUser();

  const [commentValue, setCommentValue] = useState<string>();
  const defaultReplies = useMemo(
    () => ({
      user,
      content: '',
    }),
    [user]
  );

  /**
   * @description 保存回复
   */
  const handleSave = useCallback(() => {
    const currentRelies = {
      ...defaultReplies,
      content: commentValue,
      createTime: +new Date(),
    };
    setComments(
      comments.map((comment) => {
        if (comment.id === activeCommentId) {
          let newRepies = [];
          if (comment.replies.length === 1 && !comment.replies[0].content) {
            newRepies = [currentRelies];
          } else {
            newRepies = [...comment.replies, currentRelies];
          }
          return {
            ...comment,
            replies: newRepies,
          };
        }
        return comment;
      })
    );
    setCommentValue('');
    setActiveCommentId(null);
    editor.commands.focus();
  }, [defaultReplies, commentValue, setComments, comments, setActiveCommentId, editor.commands, activeCommentId]);

  /**
   * @description 取消回复
   */
  const handleCancel = useCallback(() => {
    setCommentValue('');
    setActiveCommentId(null);
  }, [setActiveCommentId]);

  /**
   * @description 回复评论
   */
  const handleReply = useCallback(() => {
    setActiveCommentId(comment.id);
  }, [comment.id, setActiveCommentId]);

  return (
    <div
      key={comment.id}
      className={`${styles.commentItem} ${comment.id === activeCommentId ? styles.commentItemActive : ''}`}
    >
      <div className={`${comment.id === activeCommentId ? styles.commentItemActive : ''}`}></div>
      <span className={styles.selectText}>
        <a href="https://github.com/sereneinserenade" className={styles.nameText}>
          {comment.text}
        </a>

        <span className={styles.name2}>{comment.createdAt.toLocaleDateString()}</span>
      </span>
      {comment.replies.map((item) => {
        return (
          <div key={item.id} className={styles.userInfo}>
            <div className={styles.avatar}>
              <img src={item.user.avatar} alt="头像" />
            </div>
            <div className={styles.userContent}>
              <div className={styles.head}>
                <span>{item.user.name}</span>
                <span className={styles.createTime}>{item.createTime ? timeConverter(item.createTime) : ''}</span>

                <div id="reply" className={styles.replyWrapper}>
                  <div className={styles.reply}>
                    <IconComment onClick={handleReply} />
                  </div>
                  <Dropdown
                    trigger="click"
                    render={
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {}}>编辑</Dropdown.Item>
                        <Dropdown.Item>删除</Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <Button icon={<IconMore />} />
                  </Dropdown>
                </div>
              </div>
              <div className={styles.content}>{item.content}</div>
            </div>
          </div>
        );
      })}
      {comment.id === activeCommentId && (
        <CommentInput
          commentValue={commentValue}
          setCommentValue={setCommentValue}
          setActiveCommentId={setActiveCommentId}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

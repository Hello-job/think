import { Fragment, useCallback, useMemo, useState } from 'react';

import { IconComment, IconMore } from '@douyinfe/semi-icons';
import { Dropdown, Tag } from '@douyinfe/semi-ui';
import { Button, Input } from '@douyinfe/semi-ui';

import { useUser } from 'data/user';
import { timeConverter } from 'helpers/url';

import { CommentInput } from '../comment-input';

import styles from './index.module.scss';

interface SelectItem {
  id: number;
}

export const CommentItem = ({
  comment,
  activeCommentId,
  comments,
  setComments,
  setActiveCommentId,
  editor,
  onCreateTextComment,
  onCreateCommentReply,
  onCommentChange,
}) => {
  const { user } = useUser();

  const [commentValue, setCommentValue] = useState<string>();
  const [status, setStatus] = useState('add');
  const [selectItem, setSelectItem] = useState<SelectItem>({} as SelectItem);

  const defaultReplies = useMemo(
    () => ({
      user,
      content: '',
    }),
    [user]
  );

  const init = useCallback(() => {
    setCommentValue('');
    setActiveCommentId(null);
  }, [setCommentValue, setActiveCommentId]);

  const handleAdd = useCallback(() => {
    const currentRelies = {
      ...defaultReplies,
      content: commentValue,
      createTime: +new Date(),
    };
    setComments(
      comments.map(async (comment) => {
        if (comment.id === activeCommentId) {
          let newRepies = [];
          if (comment.replies.length === 1 && !comment.replies[0].content) {
            onCreateTextComment({
              text: comment.text,
              textId: comment.id,
            }).then((res) => {
              newRepies = [
                {
                  ...currentRelies,
                  id: res.id,
                },
              ];
              onCreateCommentReply({ content: commentValue, textId: res.id });
            });
          } else {
            await onCreateCommentReply({ content: commentValue, textId: comment.id });
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
  }, [
    defaultReplies,
    commentValue,
    setComments,
    comments,
    setActiveCommentId,
    editor.commands,
    activeCommentId,
    onCreateTextComment,
    onCreateCommentReply,
  ]);

  const handleItemChange = useCallback(() => {
    onCommentChange({
      content: commentValue,
      id: selectItem.id,
    }).then((res) => {
      init();
      setComments((comments) => {
        return comments.map((item) => {
          if (item.textId === comment.textId) {
            item.replies = item.replies.map((_reply) => {
              if (_reply.id === res.id) {
                return {
                  ..._reply,
                  content: commentValue,
                };
              }
              return _reply;
            });
          }
          return item;
        });
      });
    });
  }, [selectItem.id, commentValue, onCommentChange, init, setComments, comment.textId]);
  /**
   * @description 保存回复
   */
  const handleSave = useCallback(() => {
    if (status === 'add') {
      handleAdd();
    } else {
      handleItemChange();
    }
  }, [status, handleAdd, handleItemChange]);

  /**
   * @description 取消回复
   */
  const handleCancel = useCallback(() => {
    init();
  }, [init]);

  /**
   * @description 回复评论
   */
  const handleReply = useCallback(() => {
    setActiveCommentId(comment.textId);
  }, [comment.textId, setActiveCommentId]);

  const handleEdit = (data) => {
    setCommentValue(data.content);
    setActiveCommentId(comment.textId);
    setStatus('edit');
    setSelectItem(data);
  };

  const active = comment.textId === activeCommentId;

  return (
    <div key={comment.id} className={`${styles.commentItem} ${active ? styles.commentItemActive : ''}`}>
      <div className={`${active ? styles.commentItemActive : ''}`}></div>
      <span className={styles.selectText}>
        <a href="https://github.com/sereneinserenade" className={styles.nameText}>
          {comment.text}
        </a>

        <span className={styles.name2}>{comment.createdAt?.toLocaleDateString?.()}</span>
      </span>
      {comment.replies?.map((item) => {
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
                        <Dropdown.Item
                          onClick={() => {
                            handleEdit(item);
                          }}
                        >
                          编辑
                        </Dropdown.Item>
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
      {active && (
        <CommentInput
          activeCommentId={activeCommentId}
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

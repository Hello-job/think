import { useCallback, useMemo, useState } from 'react';

import { useUser } from 'data/user';
import { timeConverter } from 'helpers/url';

import { CommentInput } from '../comment-input';
import CommentItem from '../comment-item';

import styles from './index.module.scss';

interface SelectItem {
  id: number;
}

export const TextConversation = ({
  comment,
  activeCommentId,
  comments,
  setComments,
  setActiveCommentId,
  editor,
  onCreateTextComment,
  onCreateCommentReply,
  onCommentChange,
  onDeleteReply,
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

  const handleAdd = useCallback(
    (value) => {
      const findItem = comments.find((item) => [item.id, item.textId].includes(activeCommentId));
      const content = value || commentValue;
      const isAdd = findItem.replies.length === 1 && !findItem.replies[0].content;
      if (isAdd) {
        onCreateTextComment({
          text: findItem.text,
          textId: findItem.id,
        }).then((res) => {
          onCreateCommentReply({ content, textId: res.textId });
        });
      } else {
        onCreateCommentReply({ content, textId: findItem.textId });
      }
      init();
      editor.commands.focus();
    },
    [commentValue, comments, editor.commands, activeCommentId, onCreateTextComment, onCreateCommentReply, init]
  );

  const handleItemChange = useCallback(() => {
    onCommentChange({
      content: commentValue,
      id: selectItem.id,
    }).then((res) => {
      init();
    });
  }, [selectItem.id, commentValue, onCommentChange, init]);
  /**
   * @description 保存回复
   */
  const handleSave = useCallback(
    (value) => {
      if (status === 'add') {
        handleAdd(value);
      } else {
        handleItemChange();
      }
    },
    [status, handleAdd, handleItemChange]
  );

  /**
   * @description 取消回复
   */
  const handleCancel = useCallback(() => {
    init();
  }, [init]);

  /**
   * @description 回复评论
   */
  const handleReply = useCallback(
    (item) => {
      setActiveCommentId(comment.textId);
      setCommentValue(
        `<span class="comment-member" contenteditable="false" data-name="undefined">@${item.user.name}</span>&nbsp;`
      );
    },
    [comment.textId, setActiveCommentId, setCommentValue]
  );

  const handleEdit = useCallback(
    (data) => {
      onCommentChange(data).then((res) => {
        init();
      });
    },
    [onCommentChange, init]
  );

  const handleDelete = useCallback(
    (id) => {
      onDeleteReply(id);
    },
    [onDeleteReply]
  );

  const handleChange = useCallback(
    (value) => {
      setCommentValue(value);
    },
    [setCommentValue]
  );

  /**
   * 键盘事件
   */
  const handleKeyDown = useCallback(
    (value) => {
      setActiveCommentId(null);
      handleSave(value);
    },
    [handleSave, setActiveCommentId]
  );

  const active = [comment.id, comment.textId].includes(activeCommentId);

  return (
    <div key={comment.id} className={`${styles.commentItem} ${active ? styles.commentItemActive : ''}`}>
      <div className={`${active ? styles.commentItemActive : ''}`}></div>
      <span className={styles.selectText}>
        <span className={styles.nameText}>{comment.text}</span>
        <span className={styles.name2}>{comment.createdAt?.toLocaleDateString?.()}</span>
      </span>
      {comment.replies?.map((item) => {
        return (
          <CommentItem
            key={item.id}
            data={item}
            editor={editor}
            onReply={() => {
              handleReply(item);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      })}
      {active && (
        <CommentInput
          activeId={activeCommentId}
          value={commentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCancel={handleCancel}
          onOk={handleSave}
          editor={editor}
        />
      )}
    </div>
  );
};

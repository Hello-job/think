import { useEffect, useRef } from 'react';

import { Button } from '@douyinfe/semi-ui';

import styles from './index.module.scss';

export const CommentInput = ({ activeId, value, onCancel, onOk, onChange, onKeyDown }) => {
  const editableRef = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    onKeyDown?.();
  };
  const handleChange = (event) => {
    const value = (event.target as HTMLInputElement).innerHTML;
    onChange?.(value);
  };
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = value;
    }
  }, [value, editableRef]);

  return (
    <>
      <div className={styles.customContentEditable}>
        <div
          ref={editableRef}
          id={activeId}
          placeholder="输入评论"
          className={styles.customInput}
          contentEditable="true"
          onKeyDown={handleKeyDown}
          onInput={handleChange}
        ></div>
      </div>

      {/* <Input
        placeholder="输入评论"
        value={commentValue}
        className={`${styles.importInput}}`}
        onInput={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setCommentValue(value);
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          setActiveCommentId(null);
          handleSave();
        }}
      ></Input> */}

      <div className={styles.commentFooterBtn}>
        <Button theme="light" type="tertiary" style={{ marginRight: 8 }} onClick={onCancel}>
          取消
        </Button>
        <Button theme="solid" type="primary" style={{ marginRight: 8 }} onClick={onOk}>
          保存
        </Button>
      </div>
    </>
  );
};

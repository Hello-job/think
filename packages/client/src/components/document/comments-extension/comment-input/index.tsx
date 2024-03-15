import { Button, Input } from '@douyinfe/semi-ui';

import styles from './index.module.scss';

export const CommentInput = ({
  activeCommentId,
  commentValue,
  setCommentValue,
  setActiveCommentId,
  handleCancel,
  handleSave,
}) => {
  return (
    <>
      <Input
        autofocus
        id={activeCommentId}
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
      ></Input>

      <div className={styles.commentFooterBtn}>
        <Button theme="light" type="tertiary" style={{ marginRight: 8 }} onClick={handleCancel}>
          取消
        </Button>
        <Button theme="solid" type="primary" style={{ marginRight: 8 }} onClick={handleSave}>
          保存
        </Button>
      </div>
    </>
  );
};

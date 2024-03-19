import { memo, useState } from 'react';

import { IconComment, IconMore } from '@douyinfe/semi-icons';
import { Dropdown } from '@douyinfe/semi-ui';

import { timeConverter } from 'helpers/url';

import { CommentInput } from '../comment-input';

import styles from '../text-conversation/index.module.scss';
const CommentItem = ({ data, editor, onReply, onEdit, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(data.content);
  const handleCancel = () => {
    setVisible(false);
    setValue(data.content);
  };

  const handleChange = (val) => {
    setValue(val);
  };

  const handleKeyDown = (value) => {
    onEdit({
      content: value,
      id: data.id,
    });
    setVisible(false);
  };

  const handleSave = async (value) => {
    await onEdit({
      content: value,
      id: data.id,
    });
    setVisible(false);
  };
  return (
    <>
      <div key={data.id} className={styles.userInfo}>
        <div className={styles.avatar}>
          <img src={data.user.avatar} alt="头像" />
        </div>
        <div id={`commentWarp#${data.id}`} className={styles.userContent}>
          <div className={styles.head}>
            <span>{data.user.name}</span>
            <span className={styles.createTime}>{data.createTime ? timeConverter(data.createTime) : ''}</span>

            <div id="reply" className={styles.replyWrapper}>
              <div className={styles.reply}>
                <IconComment onClick={onReply} />
              </div>
              <Dropdown
                key={data.id}
                trigger="hover"
                clickToHide
                getPopupContainer={() => document.getElementById(`commentWarp#${data.id}`)}
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        // handleEdit(data);
                        setVisible(true);
                      }}
                    >
                      编辑
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(data.id)}>删除</Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <IconMore />
              </Dropdown>
            </div>
          </div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }}>
            {/* {} */}
          </div>
        </div>
      </div>
      {visible && (
        <CommentInput
          activeId={data.id}
          value={value}
          editor={editor}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCancel={handleCancel}
          onOk={handleSave}
        />
      )}
    </>
  );
};

export default memo(CommentItem);

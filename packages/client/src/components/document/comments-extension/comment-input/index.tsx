import { useEffect, useRef, useState } from 'react';

import { Button } from '@douyinfe/semi-ui';

import { MentionList } from 'tiptap/core/wrappers/mention-list';

import { getMentionUser } from 'services/user';

import styles from './index.module.scss';

/**
 * 获取符号的坐标位置
 * @param element
 * @param character
 * @returns
 */
const getPositionOfCharacter = (element, character) => {
  // 获取元素中特定字符的范围
  const range = document.createRange();
  const textNode = element.lastChild;
  const offset = textNode.textContent.indexOf(character);
  const parentNode = document.getElementById('commentContent');

  range.setStart(textNode, offset);
  range.setEnd(textNode, offset + 1);

  // 获取字符范围的边界框
  const rect = range.getBoundingClientRect();

  const parentRect = parentNode.getBoundingClientRect();

  return {
    top: Math.abs(rect.top - parentRect.top) + rect.height * 2,
    left: Math.abs(rect.left - parentRect.left),
    bottom: Math.abs(rect.bottom - parentRect.bottom),
    right: Math.abs(rect.right - parentRect.right),
  };
};

export const CommentInput = ({ activeId, value, editor, onCancel, onOk, onChange, onKeyDown }) => {
  const editableRef = useRef(null);
  const defaultPosition = {
    show: false,
    top: 0,
    left: 0,
  };
  const [mentionPosition, setMentionPosition] = useState(defaultPosition);
  const [focusNode, setFocusNode] = useState(null); // 缓存光标所在节点
  const [focusOffset, setFocusOffset] = useState(null);
  const [items, setItems] = useState([]);
  const [searchValue, ssetSearchValue] = useState('');

  const getItems = async ({ query }) => {
    const res = await getMentionUser();
    const data = (res.data || []).map((item) => item.user.name);
    const dataList = data.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()));
    setItems(dataList);
  };

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.innerHTML = value ? value : '';
    }
  }, [value, editableRef]);

  useEffect(() => {
    getItems({ query: searchValue });
  }, [searchValue]);

  const handleSelectMember = (value) => {
    const selection = window.getSelection();
    const range = window.getSelection().getRangeAt(0);
    //选中输入的@符号
    range.setStart(focusNode, focusOffset - 1);
    range.setEnd(focusNode, focusOffset);
    //删除输入的@符号
    range.deleteContents();

    const spanNode1 = document.createElement('span');
    const spanNode2 = document.createElement('span');
    spanNode1.className = 'comment-member';
    spanNode1.innerHTML = '@' + value.label;
    spanNode1.contentEditable = 'false'; //设置为不可编辑，是为了整个@xxx一起删掉
    spanNode1.setAttribute('data-name', value.userId);
    spanNode2.innerHTML = '&nbsp;';
    // eslint-disable-next-line prefer-const
    let frag = document.createDocumentFragment(),
      node,
      lastNode;
    frag.appendChild(spanNode1); //在 Range 的起点处插入一个节点。
    while ((node = spanNode2.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range?.insertNode(frag);
    selection.extend(lastNode, 1);
    selection.collapseToEnd(); //将当前的选区折叠到最末尾的一个点。

    setMentionPosition(defaultPosition);
  };

  /**
   * 键盘事件
   * @param event event对象
   * @returns
   */
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    const value = (editableRef.current as HTMLInputElement).innerHTML;
    onKeyDown?.(value);
  };

  /**
   *  获取光标位置
   * @param event
   */
  const handleMention = (event) => {
    if (mentionPosition.show) {
      if (event.nativeEvent.data === ' ') {
        setMentionPosition(defaultPosition);
      } else {
        const outerText = event.target.outerText;
        const searchText = outerText.substring(focusOffset, outerText.length);
        ssetSearchValue(searchText);
      }
    }

    if (event.nativeEvent.data === '@') {
      const selection = window.getSelection();
      setFocusNode(selection.focusNode);
      setFocusOffset(selection.focusOffset); // 缓存光标所在节点位置
      //监听输入@
      const divElement = event.target;
      const caretPosition = getPositionOfCharacter(divElement, '@');
      setMentionPosition({
        show: true,
        top: caretPosition.top,
        left: caretPosition.left,
      });
    }
  };

  /**
   * 输入事件
   * @param event event对象
   */
  const handleChange = (event) => {
    const value = (event.target as HTMLInputElement).innerHTML;
    /**
     * 处理选人组件
     */
    handleMention(event);
    // onChange?.(value);
  };

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
        >
          {/* <span className={styles.member}>属性</span> */}
        </div>
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
        <Button
          theme="solid"
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => {
            const value = (editableRef.current as HTMLInputElement).innerHTML;
            onOk(value);
          }}
        >
          保存
        </Button>
      </div>
      {mentionPosition.show && (
        <div className={styles.mentionWarp}>
          <div
            className={styles.memberSelect}
            style={{
              top: mentionPosition.top + 'px',
              left: mentionPosition.left + 'px',
            }}
          >
            <MentionList editor={editor} items={items} command={handleSelectMember} />
          </div>
        </div>
      )}
    </>
  );
};

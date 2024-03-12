import React, { useCallback, useEffect, useRef, useState } from 'react';

import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Tree as SemiTree, Typography } from '@douyinfe/semi-ui';

import { DocumentActions } from 'components/document/actions';
import { DocumentCreator as DocumenCreatorForm } from 'components/document/create';
import deepEqual from 'deep-equal';
import { CREATE_DOCUMENT, event, triggerCreateDocument } from 'event';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import scrollIntoView from 'scroll-into-view-if-needed';

import { findParents } from './utils';

import styles from './index.module.scss';

const Actions = ({ node }) => {
  const createDocument = useCallback(
    (e) => {
      e.stopPropagation();
      triggerCreateDocument({ wikiId: node.wikiId, documentId: node.id });
    },
    [node.wikiId, node.id]
  );

  return (
    <span className={styles.right}>
      <DocumentActions
        key={node.id}
        hoverVisible
        organizationId={node.organizationId}
        wikiId={node.wikiId}
        documentId={node.id}
        size="small"
        hideDocumentVersion
        hideDocumentStyle
      ></DocumentActions>
      <Button
        className={styles.hoverVisible}
        onClick={createDocument}
        type="tertiary"
        theme="borderless"
        icon={<IconPlus />}
        size="small"
      />
    </span>
  );
};

const AddDocument = () => {
  const [wikiId, setWikiId] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [visible, toggleVisible] = useToggle(false);

  useEffect(() => {
    const handler = ({ wikiId, documentId }) => {
      if (!wikiId) {
        throw new Error(`wikiId 未知，无法创建文档`);
      }
      setWikiId(wikiId);
      setDocumentId(documentId);
      toggleVisible(true);
    };

    event.on(CREATE_DOCUMENT, handler);

    return () => {
      event.off(CREATE_DOCUMENT, handler);
    };
  }, [toggleVisible]);

  return (
    <DocumenCreatorForm wikiId={wikiId} parentDocumentId={documentId} visible={visible} toggleVisible={toggleVisible} />
  );
};

let scrollTimer;

const inheritColorStyle = { color: 'inherit' };

export const _Tree = ({ data, docAsLink, getDocLink, isShareMode = false, needAddDocument = false, update }) => {
  const { query } = useRouter();
  const $container = useRef<HTMLDivElement>(null);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;
    const parentIds = findParents(data, query.documentId as string);
    setExpandedKeys(parentIds);
  }, [data, query.documentId]);

  const renderBtn = useCallback((node) => <Actions key={node.id} node={node} />, []);

  const renderLabel = useCallback(
    (label, item) => (
      <div className={styles.treeItemWrap} id={`item-${item.id}`}>
        <Link href={docAsLink} as={getDocLink(item)}>
          <a className={styles.left}>
            <Typography.Text
              ellipsis={{
                showTooltip: { opts: { content: label, style: { wordBreak: 'break-all' }, position: 'right' } },
              }}
              style={inheritColorStyle}
            >
              {label}
            </Typography.Text>
          </a>
        </Link>
        {isShareMode ? null : renderBtn(item)}
      </div>
    ),
    [isShareMode, docAsLink, getDocLink, renderBtn]
  );

  useEffect(() => {
    const target = $container.current.querySelector(`#item-${query.documentId}`);
    if (!target) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      scrollIntoView(target, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }, 500);

    return () => {
      clearTimeout(scrollTimer);
    };
  }, [query.documentId]);

  const handleDrop = (info) => {
    const { dropToGap, node, dragNode } = info;
    const dropKey = node.key;
    const dragKey = dragNode.key;
    const dropPos = node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const _data = [...data];
    const loop = (data, key, callback) => {
      data.forEach((item, ind, arr) => {
        if (item.key === key) return callback(item, ind, arr);
        if (item.children) return loop(item.children, key, callback);
      });
    };
    let dragObj;
    loop(_data, dragKey, (item, ind, arr) => {
      arr.splice(ind, 1);
      dragObj = item;
    });

    if (!dropToGap) {
      // inset into the dropPosition
      loop(_data, dropKey, (item, ind, arr) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (dropPosition === 1 && node.children && node.expanded) {
      // has children && expanded and drop into the node bottom gap
      // insert to the top
      loop(_data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let dropNodeInd;
      let dropNodePosArr;
      loop(_data, dropKey, (item, ind, arr) => {
        dropNodePosArr = arr;
        dropNodeInd = ind;
      });
      if (dropPosition === -1) {
        // insert to top
        dropNodePosArr.splice(dropNodeInd, 0, dragObj);
      } else {
        // insert to bottom
        dropNodePosArr.splice(dropNodeInd + 1, 0, dragObj);
      }
    }
    const newData = _data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    update(newData);
  };

  return (
    <div className={styles.treeInnerWrap} ref={$container}>
      <SemiTree
        treeData={data}
        draggable
        renderLabel={renderLabel}
        value={query.documentId}
        defaultExpandedKeys={expandedKeys}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        motion={false}
        onDrop={handleDrop}
      />
      {needAddDocument && <AddDocument />}
    </div>
  );
};

export const Tree = React.memo(_Tree, (prevProps, nextProps) => {
  if (deepEqual(prevProps.data, nextProps.data)) {
    return true;
  }

  return false;
});

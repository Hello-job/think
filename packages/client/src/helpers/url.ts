export const buildUrl = (url) => {
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url}`;
};

export const getWikiShareURL = (wikiId) => {
  const url = '/share/wiki/' + wikiId;
  if (typeof window === 'undefined') return url;
  return window.location.origin + url;
};

export const getDocumentShareURL = (documentId) => {
  const url = '/share/document/' + documentId;
  if (typeof window === 'undefined') return url;
  return window.location.origin + url;
};

export function timeConverter(timestamp): string {
  // 将时间戳转换为 Date 对象
  const date = new Date(timestamp);
  // 获取当前时间
  const now = new Date();

  // 计算时间差
  const diff = now.getTime() - date.getTime();

  // 将时间差转换为分钟
  const minutes = Math.floor(diff / (1000 * 60));

  // 将时间差转换为小时
  const hours = Math.floor(diff / (1000 * 60 * 60));

  // 将时间差转换为天数
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 判断时间差
  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    // 返回年月日
    return date.toLocaleDateString();
  }
}

// Small helpers shared by the Shorts rail, carousel, page and player.

// hqdefault exists for every YouTube video and is ~20KB (maxres is 5-10x bigger),
// which keeps long scrolling grids light. Cropped with object-cover it shows the
// vertical frame of a Short.
export const shortThumb = (short) =>
  short?.videoId
    ? `https://i.ytimg.com/vi/${short.videoId}/hqdefault.jpg`
    : short?.thumbnail || null;

export const formatViews = (views) => {
  const n = Number(views) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
};

export const formatDate = (value) => {
  if (!value) return 'Recent';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recent';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

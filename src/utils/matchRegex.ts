export const validateYouTubeUrl = (url: string) => {
  const youtubePattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
  const match = url.match(youtubePattern);
  return match !== null;
};

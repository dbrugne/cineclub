const videosExtensions = [
  'mpg',
  'mpe',
  'mpeg',
  'avi',
  'mov',
  'qt',
  'wmv',
  'rm',
  'mp4',
  '3gp',
  'ogm',
  'mkv',
];

module.exports = (files) => files.filter((f) => {
  let extension = f.data.info.ext;
  if (typeof extension === 'undefined' || extension === '') {
    return false;
  }
  if (extension.substr(0, 1) === '.') {
    extension = extension.substr(1);
  }
  if (videosExtensions.indexOf(extension.toLocaleLowerCase()) === -1) {
    return false;
  }
  return !(/.*sample$/i.test(f.data.info.name));
});

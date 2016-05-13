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
  // filter on extension
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

  // filter samples
  const name = f.data.info.name;
  return !(/.*sample$/i.test(name) || /.*SAMPLE.*/.test(name));
});

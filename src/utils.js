const fs = require('fs');

function mkdir(path) {
  var pathSplitArr = path.split('/');
  pathSplitArr.reduce((wholePath, path) => {
    wholePath += `/${path}`;
    if (!fs.existsSync(wholePath)) {
      fs.mkdirSync(wholePath);
    }
    return wholePath;
  });
}

module.exports = {
  mkdir,
};

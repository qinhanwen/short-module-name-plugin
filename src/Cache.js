const findCacheDir = require('find-cache-dir');
const fs = require('fs');
const path = require('path');
const { mkdir } = require('./utils');

const PATH = 'short-module-name-plugin';
const FILENAME = 'short-module-name-plugin.json';

class Cache {
  constructor() {}

  get() {
    const filePath = path.resolve(findCacheDir({ name: PATH }), FILENAME);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath).toString());
    }
    return {};
  }

  async store(data) {
    mkdir(findCacheDir({ name: PATH }));
    fs.writeFileSync(
      path.resolve(findCacheDir({ name: PATH }), FILENAME),
      JSON.stringify(data),
      'utf8'
    );
  }
}

module.exports = Cache;

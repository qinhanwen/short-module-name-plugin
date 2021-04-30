const createHash = require('webpack/lib/util/createHash');
const RequestShortener = require('webpack/lib/RequestShortener');
const lodash = require('lodash');
const Cache = require('./Cache');

const getHash = (str) => {
  const hash = createHash('md4');
  hash.update(str);
  const digest = /** @type {string} */ (hash.digest('hex'));
  return digest.substr(0, 4);
};
class ShortModuleNamePlugin {
  constructor(options) {
    this.options = options || {};
    this.cache = new Cache();
    this.index = 0;
  }

  getModuleName(wholePath) {
    let moduleName = '';
    if (!lodash.isNil(this.staticDictionary[wholePath])) {
      moduleName = this.staticDictionary[wholePath];
    } else {
      this.staticDictionary[wholePath] = this.index++;
      moduleName = this.staticDictionary[wholePath];
    }
    return moduleName;
  }

  apply(compiler) {
    this.staticDictionary = this.cache.get();
    const index = Object.values(this.staticDictionary).sort((a, b) => b - a)[0];
    this.index = index ? index + 1 : 0;
    compiler.hooks.compilation.tap('ShortModuleNamePlugin', (compilation) => {
      compilation.hooks.beforeModuleIds.tap(
        'ShortModuleNamePlugin',
        (modules) => {
          const namedModules = new Map();
          const context = this.options.context || compiler.options.context;

          for (const module of modules) {
            if (module.id === null && module.libIdent) {
              module.id = this.getModuleName(module.libIdent({ context }));
            }

            if (module.id !== null) {
              const namedModule = namedModules.get(module.id);
              if (namedModule !== undefined) {
                namedModule.push(module);
              } else {
                namedModules.set(module.id, [module]);
              }
            }
          }

          for (const namedModule of namedModules.values()) {
            if (namedModule.length > 1) {
              for (const module of namedModule) {
                const requestShortener = new RequestShortener(context);
                module.id = `${module.id}?${getHash(
                  requestShortener.shorten(module.identifier())
                )}`;
              }
            }
          }
        }
      );
    });

    compiler.hooks.compilation.tap('ShortModuleNamePlugin', (compilation) => {
      compilation.hooks.beforeChunkIds.tap(
        'ShortModuleNamePlugin',
        (chunks) => {
          for (const chunk of chunks) {
            if (chunk.id === null) {
              chunk.id = this.getModuleName(chunk.name);
            }
          }
        }
      );
    });

    compiler.hooks.done.tap('ShortModuleNamePlugin', () => {
      this.cache.store(this.staticDictionary);
    });
  }
}

module.exports = ShortModuleNamePlugin;

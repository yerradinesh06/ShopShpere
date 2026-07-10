const { getIsLocalDB } = require('../config/db');
const { LocalModel, readData, writeData } = require('./dbAdapter');

function createDynamicModel(modelName, mongooseModel, collectionName) {
  const localModel = new LocalModel(collectionName);

  // A dummy constructor function so that the Proxy can be called with 'new'
  function ModelDummy() {}

  return new Proxy(ModelDummy, {
    // Traps static property access, e.g. User.find(), User.findOne()
    get(target, prop) {
      const isLocal = getIsLocalDB();
      const activeModel = isLocal ? localModel : mongooseModel;
      
      const value = activeModel[prop];
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },

    // Traps instantiation, e.g. new User({ name: 'Alex' })
    construct(target, args) {
      const isLocal = getIsLocalDB();
      const data = args[0] || {};

      if (isLocal) {
        // Create local instance mimicking mongoose document
        const instance = {
          _id: data._id || Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          ...data
        };

        // Attach save method
        Object.defineProperty(instance, 'save', {
          value: async function() {
            const dbData = readData();
            if (!dbData[collectionName]) {
              dbData[collectionName] = [];
            }
            const collection = dbData[collectionName];
            const index = collection.findIndex(item => item._id === this._id);
            const serialized = { ...this };

            if (index !== -1) {
              collection[index] = serialized;
            } else {
              collection.push(serialized);
            }
            writeData(dbData);
            return this;
          },
          enumerable: false,
          configurable: true
        });

        return instance;
      } else {
        return new mongooseModel(...args);
      }
    }
  });
}

module.exports = createDynamicModel;

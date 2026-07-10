const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/db.json');

// Ensure parent directories exist
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure db.json exists with standard collection keys
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], products: [], orders: [] }, null, 2));
}

function readData() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], products: [], orders: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Simple query matcher for JSON filtering
function matches(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key in query) {
    const queryVal = query[key];
    const itemVal = item[key];

    // Regex support (search filters)
    if (queryVal && queryVal.$regex) {
      const regex = new RegExp(queryVal.$regex, queryVal.$options || 'i');
      if (!regex.test(itemVal || '')) return false;
      continue;
    }

    // Comparison operators support (price filters)
    if (queryVal && typeof queryVal === 'object' && !Array.isArray(queryVal)) {
      let match = true;
      if ('$gte' in queryVal && !(itemVal >= queryVal.$gte)) match = false;
      if ('$lte' in queryVal && !(itemVal <= queryVal.$lte)) match = false;
      if ('$gt' in queryVal && !(itemVal > queryVal.$gt)) match = false;
      if ('$lt' in queryVal && !(itemVal < queryVal.$lt)) match = false;
      if ('$in' in queryVal && !queryVal.$in.includes(itemVal)) match = false;
      if (!match) return false;
      continue;
    }

    // Exact match
    if (itemVal !== queryVal) return false;
  }
  return true;
}

// Wrapper for documents to support mongoose instance helper methods
class ModelInstance {
  constructor(data, collectionName) {
    Object.assign(this, data);
    Object.defineProperty(this, '_collectionName', { value: collectionName, enumerable: false });
  }

  async save() {
    const dbData = readData();
    const collection = dbData[this._collectionName];
    const index = collection.findIndex(item => item._id === this._id);
    const serialized = { ...this };

    if (index !== -1) {
      collection[index] = serialized;
    } else {
      collection.push(serialized);
    }
    writeData(dbData);
    return this;
  }
}

// Chainable query object to support sort, limit, skip, select, populate
class QueryChain {
  constructor(results, collectionName) {
    this.results = results;
    this.collectionName = collectionName;
  }

  // Makes the chain thenable, meaning it can be directly awaited
  then(onFulfilled, onRejected) {
    const instances = this.results.map(item => new ModelInstance(item, this.collectionName));
    return Promise.resolve(instances).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    const instances = this.results.map(item => new ModelInstance(item, this.collectionName));
    return Promise.resolve(instances).catch(onRejected);
  }

  sort(sortOption) {
    if (!sortOption) return this;
    const key = Object.keys(sortOption)[0];
    const direction = sortOption[key];
    this.results.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === 'string') {
        return direction === -1 ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return direction === -1 ? valB - valA : valA - valB;
    });
    return this;
  }

  select(selectOption) {
    // For local DB, we return full fields but can limit if needed
    return this;
  }

  limit(limitCount) {
    if (typeof limitCount === 'number') {
      this.results = this.results.slice(0, limitCount);
    }
    return this;
  }

  skip(skipCount) {
    if (typeof skipCount === 'number') {
      this.results = this.results.slice(skipCount);
    }
    return this;
  }

  populate(field, selectFields) {
    const dbData = readData();
    this.results = this.results.map(item => {
      const cloned = { ...item };
      if (field === 'user' && cloned.user) {
        const userIdStr = cloned.user.toString();
        const userObj = dbData.users.find(u => u._id === userIdStr);
        if (userObj) {
          cloned.user = selectFields
            ? selectFields.split(' ').reduce((acc, f) => { acc[f] = userObj[f]; return acc; }, { _id: userObj._id })
            : { ...userObj };
        }
      }
      return cloned;
    });
    return this;
  }
}

class LocalModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  find(query = {}) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    const filtered = collection.filter(item => matches(item, query));
    return new QueryChain(filtered, this.collectionName);
  }

  async findOne(query = {}) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    const item = collection.find(item => matches(item, query));
    return item ? new ModelInstance(item, this.collectionName) : null;
  }

  async findById(id) {
    const idStr = id ? id.toString() : '';
    return this.findOne({ _id: idStr });
  }

  async create(data) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    collection.push(newDoc);
    dbData[this.collectionName] = collection;
    writeData(dbData);
    return new ModelInstance(newDoc, this.collectionName);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    const idStr = id ? id.toString() : '';
    const index = collection.findIndex(item => item._id === idStr);
    if (index === -1) return null;

    const original = collection[index];
    const updateData = update.$set || update; // support $set format or flat update
    const updated = {
      ...original,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    collection[index] = updated;
    dbData[this.collectionName] = collection;
    writeData(dbData);
    return new ModelInstance(updated, this.collectionName);
  }

  async findByIdAndDelete(id) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    const idStr = id ? id.toString() : '';
    const index = collection.findIndex(item => item._id === idStr);
    if (index === -1) return null;

    const removed = collection.splice(index, 1)[0];
    dbData[this.collectionName] = collection;
    writeData(dbData);
    return new ModelInstance(removed, this.collectionName);
  }

  async countDocuments(query = {}) {
    const dbData = readData();
    const collection = dbData[this.collectionName] || [];
    return collection.filter(item => matches(item, query)).length;
  }
}

module.exports = {
  LocalModel,
  readData,
  writeData
};

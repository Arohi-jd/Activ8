class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findById(id) {
    return this.model.findById(id);
  }

  findOne(filter) {
    return this.model.findOne(filter);
  }

  find(filter = {}, options = {}) {
    const query = this.model.find(filter);

    if (options.populate) {
      query.populate(options.populate);
    }

    if (options.sort) {
      query.sort(options.sort);
    }

    if (typeof options.skip === 'number') {
      query.skip(options.skip);
    }

    if (typeof options.limit === 'number') {
      query.limit(options.limit);
    }

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  create(data) {
    return this.model.create(data);
  }

  updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;

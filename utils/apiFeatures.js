class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // FILTERING
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryStr };
    const excludedFields = [`page`, `sort`, `limit`, `fields`];

    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Build query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const userSort = this.queryStr.sort.split(`,`).join(` `);
      const sortBy = `-featured ${userSort}`;
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(`-featured -postedDate`);
    }
    return this;
  }

  limitFields() {
    // FILTERING
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(`,`).join(` `);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(`-__v`);
    }
    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 5000;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQueryAux = { ...req.query };

  console.log(req.query);

  // Fields to exclude to be used not like a just a value
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete
  removeFields.forEach(param => delete reqQueryAux[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQueryAux);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-averageCost");
  }

  // Pagination
  const totalDocs = await model.countDocuments();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  query = query.skip(startIndex).limit(limit);

  // Populate
  if (populate) {
    query = query.populate(populate);
  }

  // Execute Query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 1) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;

export const pageSizeQuery = {
  name: 'pageSize',
  description: 'Number of elements to return',
  required: false,
  schema: { default: 9, type: 'integer' },
};

export const pageNumberQuery = {
  name: 'pageNumber',
  description: 'Page number to return',
  required: false,
  schema: { default: 1, type: 'integer' },
};

export const sortDirectionQuery = {
  name: 'sortDirection',
  required: false,
  schema: { type: 'string', default: 'desc' },
  enum: ['asc', 'desc'],
};

export const sortByQuery = {
  name: 'sortBy',
  description: 'What field to sort by',
  required: false,
  schema: { default: 'createdAt' },
};

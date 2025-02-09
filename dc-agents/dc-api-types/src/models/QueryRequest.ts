/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Query } from './Query';
import type { ScalarValue } from './ScalarValue';
import type { TableName } from './TableName';
import type { TableRelationships } from './TableRelationships';

export type QueryRequest = {
  /**
   * If present, a list of columns and values for the columns that the query must be repeated for, applying the column values as a filter for each query.
   */
  foreach?: Array<Record<string, ScalarValue>> | null;
  query: Query;
  table: TableName;
  /**
   * The relationships between tables involved in the entire query request
   */
  table_relationships: Array<TableRelationships>;
};


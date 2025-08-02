/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "./constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;

  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  // -------------------------//
  filter(): this {
    const filter = { ...this.query };

    for (const filed of excludeField) {
      delete filter[filed];
    }

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  // -----------------------------//

  search(searchAbleField: string[]): this {
    const search = this.query.search || "";

    const searchQuery = {
      $or: searchAbleField.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }
  // -----------------------------//

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  // -----------------------------//

  populate(field: string, poperty?: string): this {
    this.modelQuery = this.modelQuery.populate(field, poperty);
    return this;
  }
  // -----------------------------//

  pagenate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 2;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }
  // -----------------------------//

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 2;
    const totalPage = Math.ceil(totalDocuments / limit);

    return { total: totalDocuments, totalPage, page, limit };
  }
}

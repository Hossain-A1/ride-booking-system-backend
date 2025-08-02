"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("./constants");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // -------------------------//
    filter() {
        const filter = Object.assign({}, this.query);
        for (const filed of constants_1.excludeField) {
            delete filter[filed];
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    // -----------------------------//
    search(searchAbleField) {
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
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // -----------------------------//
    pagenate() {
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
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 2;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { total: totalDocuments, totalPage, page, limit };
        });
    }
}
exports.QueryBuilder = QueryBuilder;

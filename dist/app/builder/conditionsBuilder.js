"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionsBuilder = void 0;
const pagination_constant_1 = require("../constant/pagination.constant");
const pick_1 = __importDefault(require("../shared/pick"));
const buildConditionsForPrisma = (query, andConditions, fields) => {
    const filterFields = (0, pick_1.default)(query, [
        ...pagination_constant_1.globalQueryOptions,
        ...fields.filterableStringFields,
        ...fields.filterableNumberFields,
        ...fields.filterableBooleanFields,
    ]);
    const { searchTerm } = filterFields, filterData = __rest(filterFields, ["searchTerm"]);
    /* Convert String to Number type */
    if (filterData && fields.filterableNumberFields) {
        for (const key of fields.filterableNumberFields) {
            if (Object.hasOwnProperty.call(filterData, key)) {
                filterData[key] = Number(filterData[key]);
            }
        }
    }
    /* Convert String to Boolean type */
    if (filterData && fields.filterableBooleanFields) {
        for (const key of fields.filterableBooleanFields) {
            if (Object.hasOwnProperty.call(filterData, key)) {
                filterData[key] = Boolean(filterData[key]);
            }
        }
    }
    /* Search */
    if (searchTerm) {
        andConditions.push({
            OR: fields.searchable.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    /* Filter */
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    return andConditions;
};
exports.ConditionsBuilder = {
    prisma: buildConditionsForPrisma,
};

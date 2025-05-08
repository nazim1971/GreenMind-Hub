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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideaFilters = void 0;
const idea_constants_1 = require("./idea.constants");
const ideaFilters = (params) => {
    if (!params)
        return undefined;
    const { searchTerm, minPrice, maxPrice } = params, restFilters = __rest(params, ["searchTerm", "minPrice", "maxPrice"]);
    const andConditions = [];
    // handle all searchTerm here by OR condition
    if (searchTerm) {
        andConditions.push({
            OR: idea_constants_1.ideaSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // handle minPricee here by AND condition
    if (minPrice) {
        andConditions.push({
            AND: [
                {
                    price: {
                        gte: minPrice,
                    },
                },
            ],
        });
    }
    // handle maxPrice here by AND condition
    if (maxPrice) {
        andConditions.push({
            AND: [
                {
                    price: {
                        lte: maxPrice,
                    },
                },
            ],
        });
    }
    // handle all restFilters here by AND condition
    if (Object.keys(restFilters).length > 0) {
        if (typeof restFilters.isPaid === 'string' &&
            restFilters.isPaid === 'true') {
            restFilters.isPaid = true;
        }
        else if (typeof restFilters.isPaid === 'string' &&
            restFilters.isPaid === 'false') {
            restFilters.isPaid = false;
        }
        andConditions.push({
            AND: Object.keys(restFilters).map((key) => {
                return {
                    [key]: { equals: restFilters[key] },
                };
            }),
        });
    }
    andConditions.push({ isDeleted: false });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    return whereConditions;
};
exports.ideaFilters = ideaFilters;

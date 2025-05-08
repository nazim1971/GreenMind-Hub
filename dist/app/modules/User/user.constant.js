"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.ideaFields = exports.adminFilterAbleFields = exports.defaultUserImage = void 0;
exports.defaultUserImage = "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1746549642/auudt3jjhytdbr0rr839.png";
exports.adminFilterAbleFields = ["name", "email", "searchTerm"];
exports.ideaFields = {
    tableName: 'Idea',
    searchable: [],
    filterableStringFields: [],
    filterableNumberFields: [],
    filterableBooleanFields: [],
};
exports.userFields = {
    tableName: 'User',
    searchable: [],
    filterableStringFields: [],
    filterableNumberFields: [],
    filterableBooleanFields: [],
};

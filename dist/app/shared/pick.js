"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    // console.log(obj, keys);
    const finalObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            // console.log(key);
            finalObj[key] = obj[key];
        }
    }
    console.log("Final Obj", finalObj);
    return finalObj;
};
exports.default = pick;

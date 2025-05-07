export const defaultUserImage = "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1746549642/auudt3jjhytdbr0rr839.png"

import { TModelFieldsType } from "../../interfaces/globalTypes";

export const adminFilterAbleFields = ["name", "email", "searchTerm"];

export const ideaFields: TModelFieldsType = {
    tableName: 'Idea',
    searchable: [],
    filterableStringFields: [],
    filterableNumberFields: [],
    filterableBooleanFields: [],
  };
  
  export const userFields: TModelFieldsType = {
    tableName: 'User',
    searchable: [],
    filterableStringFields: [],
    filterableNumberFields: [],
    filterableBooleanFields: [],
  };
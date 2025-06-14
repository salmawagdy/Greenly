import { roleTypes } from "../../DB/model/userModel.js";

export const endpoint = {
  loan: [roleTypes.user],
  getAll:[roleTypes.admin]
};

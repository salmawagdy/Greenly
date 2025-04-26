import { roleTypes } from "../../DB/model/userModel.js";

export const endpoint = {
    createPost: [roleTypes.user],
    deletePost:[roleTypes.user,roleTypes.admin]
}
import { roleTypes } from "../../DB/model/userModel.js"

export const endpoint = {
    addToCart: [roleTypes.user],
    removecart: [roleTypes.user],
    clearcart:[roleTypes.user]
}
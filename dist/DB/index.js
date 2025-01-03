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
exports.seedSuperAdmin = void 0;
const user_model_1 = require("../modules/basic_modules/user/user.model");
const user_service_1 = require("../modules/basic_modules/user/user.service");
const admin = {
    name: "MD Admin",
    email: "admin@gmail.com",
    password: "1qazxsw2",
    role: "admin",
    isDeleted: false,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isSuperAdminExists = yield user_model_1.UserModel.findOne({ email: admin.email });
    if (!isSuperAdminExists) {
        const hashedPassword = yield (0, user_service_1.hashPassword)(admin.password);
        const adminWithHashedPassword = Object.assign(Object.assign({}, admin), { password: hashedPassword });
        // console.log("Super Admin created");
        yield user_model_1.UserModel.create(adminWithHashedPassword);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
exports.default = exports.seedSuperAdmin;

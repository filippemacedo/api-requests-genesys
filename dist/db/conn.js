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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGODB_URI;
let dbConnection;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dbConnection) {
            console.log('Já está conectado ao MongoDB.');
            return dbConnection;
        }
        try {
            yield mongoose_1.default.connect(uri);
            console.log('Conectou ao MongoDB com Mongoose');
            dbConnection = mongoose_1.default;
            return dbConnection;
        }
        catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        // Seu código aqui que depende da conexão com o banco de dados
    }
    catch (error) {
        console.error(error);
    }
}))();
exports.default = mongoose_1.default;
//# sourceMappingURL=conn.js.map
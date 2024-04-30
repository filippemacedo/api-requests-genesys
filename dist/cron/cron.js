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
const RequestsController_1 = __importDefault(require("../controllers/RequestsController"));
const getToken_1 = require("../utils/getToken");
const axios_1 = __importDefault(require("axios"));
const Requests_1 = __importDefault(require("../models/Requests"));
const http_status_codes_1 = require("http-status-codes");
function getRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Cron rodando');
        const token = yield (0, getToken_1.getToken)();
        const response = yield axios_1.default.post('https://api.sae1.pure.cloud/api/v2/analytics/users/details/query', {
            "order": "desc",
            "orderBy": "conversationStart",
            "paging": {
                "pageSize": 50,
                "pageNumber": 1
            },
            "segmentFilters": [
                {
                    "type": "or",
                    "predicates": [
                        {
                            "dimension": "direction",
                            "value": "inbound"
                        }
                    ]
                }
            ],
            "conversationFilters": [],
            "evaluationFilters": [],
            "surveyFilters": [],
            "interval": "2023-01-01T03:00:00.000Z/2023-01-06T03:00:00.000Z"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.data) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Nenhum registro encontrado'
            });
        }
        if (response.data.error) {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: response.data.error
            });
        }
        for (const userDetail of response.data.userDetails) {
            try {
                let userName = yield RequestsController_1.default.getUserByUserId(userDetail.userId);
                if (userName.message) {
                    userName = null;
                }
                userDetail.userName = userName === null || userName === void 0 ? void 0 : userName.name;
                const requestExists = yield Requests_1.default.findOne({ userId: userDetail.userId });
                if (requestExists) {
                    yield requestExists.updateOne(userDetail);
                    console.log('Requisição atualizada');
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: 'Requisição atualizada',
                    });
                }
                const request = new Requests_1.default(userDetail);
                yield request.save();
                console.log('Requisição salva');
            }
            catch (error) {
                console.log(error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error
                });
            }
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Requisição criada',
        });
    });
}
exports.default = getRequests;
//# sourceMappingURL=cron.js.map
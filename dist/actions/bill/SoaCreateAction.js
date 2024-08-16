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
const client_1 = __importDefault(require("../../utils/client"));
const validationSchemas_1 = require("../../utils/validationSchemas");
const date_fns_1 = require("date-fns");
class SoaCreateAction {
    static getNextReferenceNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const lastBill = yield client_1.default.bill.findFirst({
                where: {},
                orderBy: {
                    id: 'desc',
                },
            });
            if (!lastBill) {
                return "OEC00000001";
            }
            const lastReferenceNumber = lastBill.referenceNumber;
            const lastNumber = parseInt(lastReferenceNumber.slice(3), 10);
            const nextNumber = (lastNumber + 1).toString().padStart(8, '0');
            return `OEC${nextNumber}`;
        });
    }
    static execute(data, mId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const accountRegistry = await prisma.accountRegistry.findFirst({
            //     where: {
            //         userId: Uid,
            //         meterId: mId
            //     }, 
            //     include: {
            //         meterAccount: true
            //     }
            // })
            // if (!accountRegistry) {
            //     throw new Error("Account registry not found.");
            // }
            const { kwhConsume, rate } = data;
            const lastBill = yield client_1.default.bill.findFirst({
                where: {
                    meterAccountId: mId,
                    deletedAt: null,
                },
                orderBy: {
                    id: 'desc'
                }
            });
            const cRead = lastBill ? lastBill.cRead + kwhConsume : kwhConsume;
            const pRead = lastBill ? lastBill.cRead : 0;
            const amount = rate * kwhConsume + data.distribution + data.generation + data.sLoss +
                data.transmission + data.subsidies + data.gTax + data.fitAll + data.applied + data.other + data.uCharges;
            const fromDate = data.fromDate;
            const toDate = data.toDate;
            const nextDate = data.nextDate;
            const dueDate = data.dueDate;
            const billDate = data.billDate;
            const readingDate = data.readingDate;
            const formattedNextDate = (0, date_fns_1.formatISO)(nextDate);
            const formattedFromDate = (0, date_fns_1.formatISO)(fromDate);
            const formattedToDate = (0, date_fns_1.formatISO)(toDate);
            const formattedDueDate = (0, date_fns_1.formatISO)(dueDate);
            const formattedBillDate = (0, date_fns_1.formatISO)(billDate);
            const formattedReadingDate = (0, date_fns_1.formatISO)(readingDate);
            const referenceNumber = yield this.getNextReferenceNumber();
            return yield client_1.default.bill.create({
                data: Object.assign(Object.assign({}, data), { cRead: cRead, pRead: pRead, amount: amount, fromDate: formattedFromDate, toDate: formattedToDate, nextDate: formattedNextDate, dueDate: formattedDueDate, billDate: formattedBillDate, readingDate: formattedReadingDate, referenceNumber: referenceNumber, meterAccountId: mId }),
            });
        });
    }
    static calculateDetails(data, mId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { kwhConsume, rate } = data;
            const lastBill = yield client_1.default.bill.findFirst({
                where: {
                    meterAccountId: mId,
                    deletedAt: null
                },
                orderBy: {
                    id: 'desc'
                }
            });
            const fromDate = data.fromDate;
            const toDate = data.toDate;
            const nextDate = data.nextDate;
            const dueDate = data.dueDate;
            const billDate = data.billDate;
            const readingDate = data.readingDate;
            const formattedNextDate = (0, date_fns_1.formatISO)(nextDate);
            const formattedFromDate = (0, date_fns_1.formatISO)(fromDate);
            const formattedToDate = (0, date_fns_1.formatISO)(toDate);
            const formattedDueDate = (0, date_fns_1.formatISO)(dueDate);
            const formattedBillDate = (0, date_fns_1.formatISO)(billDate);
            const formattedReadingDate = (0, date_fns_1.formatISO)(readingDate);
            const distributionCharge = data.distribution;
            const generationCharge = data.generation;
            const systemLossCharge = data.sLoss;
            const transmissionCharge = data.transmission;
            const subsidiesCharge = data.subsidies;
            const governmentTax = data.gTax;
            const fitAllCharge = data.fitAll;
            const appliedCharge = data.applied;
            const otherCharge = data.other;
            const uCharges = data.uCharges;
            const referenceNumber = yield this.getNextReferenceNumber();
            const totalAmount = (rate * kwhConsume) +
                distributionCharge +
                generationCharge +
                systemLossCharge +
                transmissionCharge +
                subsidiesCharge +
                governmentTax +
                fitAllCharge +
                appliedCharge +
                otherCharge +
                uCharges;
            const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));
            const cRead = lastBill ? lastBill.cRead + kwhConsume : kwhConsume;
            const pRead = lastBill ? lastBill.cRead : 0;
            return {
                formattedBillDate,
                formattedDueDate,
                formattedFromDate,
                formattedNextDate,
                formattedReadingDate,
                formattedToDate,
                distributionCharge,
                generationCharge,
                systemLossCharge,
                transmissionCharge,
                subsidiesCharge,
                governmentTax,
                fitAllCharge,
                appliedCharge,
                otherCharge,
                uCharges,
                referenceNumber,
                kwhConsume,
                rate,
                cRead,
                pRead,
                totalAmount: roundedTotalAmount
            };
        });
    }
    static validate(data) {
        return validationSchemas_1.billCreationSchema.safeParse(data);
    }
}
exports.default = SoaCreateAction;
//# sourceMappingURL=SoaCreateAction.js.map
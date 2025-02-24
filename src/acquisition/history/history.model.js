import mongoose from "mongoose";

const PurchaseHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    invoices: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Invoice' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('PurchaseHistory', PurchaseHistorySchema);
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('Product', ProductSchema);
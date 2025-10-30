import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface POSItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface POSState {
  items: POSItem[];
  discount: number;
  tax: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_PAYMENT' | 'BANK_TRANSFER';
  customerInfo: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  isScanning: boolean;
  currentSale: {
    id?: string;
    invoiceNo?: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  } | null;
}

const initialState: POSState = {
  items: [],
  discount: 0,
  tax: 0,
  paymentMethod: 'CASH',
  customerInfo: {},
  isScanning: false,
  currentSale: null,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<POSItem, 'totalPrice'>>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        state.items.push({
          ...action.payload,
          totalPrice: action.payload.price * action.payload.quantity,
        });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.price * item.quantity;
      }
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    setTax: (state, action: PayloadAction<number>) => {
      state.tax = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<POSState['paymentMethod']>) => {
      state.paymentMethod = action.payload;
    },
    setCustomerInfo: (state, action: PayloadAction<Partial<POSState['customerInfo']>>) => {
      state.customerInfo = { ...state.customerInfo, ...action.payload };
    },
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setCurrentSale: (state, action: PayloadAction<POSState['currentSale']>) => {
      state.currentSale = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = 0;
      state.tax = 0;
      state.customerInfo = {};
      state.currentSale = null;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setDiscount,
  setTax,
  setPaymentMethod,
  setCustomerInfo,
  setScanning,
  setCurrentSale,
  clearCart,
} = posSlice.actions;

export default posSlice.reducer;

// Selectors
export const selectSubtotal = (state: { pos: POSState }) =>
  state.pos.items.reduce((sum, item) => sum + item.totalPrice, 0);

export const selectTotal = (state: { pos: POSState }) => {
  const subtotal = selectSubtotal(state);
  const discount = state.pos.discount;
  const tax = state.pos.tax;
  return subtotal - discount + tax;
};
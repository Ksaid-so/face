import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  staff: {
    name: string;
    email?: string;
  };
  customerInfo?: CustomerInfo;
  createdAt: string;
}

interface SalesState {
  sales: Sale[];
  selectedSale: Sale | null;
  isLoading: boolean;
}

const initialState: SalesState = {
  sales: [],
  selectedSale: null,
  isLoading: false,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.unshift(action.payload); // Add to beginning of array
    },
    setSales: (state, action: PayloadAction<Sale[]>) => {
      state.sales = action.payload;
    },
    setSelectedSale: (state, action: PayloadAction<Sale | null>) => {
      state.selectedSale = action.payload;
    },
    updateSaleStatus: (state, action: PayloadAction<{ id: string; status: Sale['status'] }>) => {
      const sale = state.sales.find(s => s.id === action.payload.id);
      if (sale) {
        sale.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearSales: (state) => {
      state.sales = [];
      state.selectedSale = null;
    },
  },
});

export const {
  addSale,
  setSales,
  setSelectedSale,
  updateSaleStatus,
  setLoading,
  clearSales,
} = salesSlice.actions;

export default salesSlice.reducer;
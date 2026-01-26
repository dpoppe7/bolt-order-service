/**
 * @file web/src/types/api.ts
 * @description Shared Type Definitions (The Contract). 
 * These are objects that index.ts (the backend) sends and the web client (App.tsx) can import.
 */

// Product structure as represented in the backend (Prisma schema)
export interface Product {
    id: string; // matches prisma schema id
    name: string;
    stock: number;
    price?: number; //optional price field
}

// what the client sends to the server to place an order
export interface OrderRequest {
    productId: string;
    quantity: number;
}

// What the server responds with after an order attempt
export interface OrderResponse {
    newStock?: number; // updated stock after order is placed
    message: string;
    oderId?: string; // order identifier: matches prisma order if (default autoincrement)
}

// Response from /health endpoint (the UI get this values on load)
export interface HealthResponse {
    status: 'online' | 'offline'; // server status
    redis: boolean; // is redis connected
    products: Product[]; // list of products with stock info
}
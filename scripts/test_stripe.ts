import dotenv from 'dotenv';
import path from 'path';
import Stripe from 'stripe';

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, '../.env') });

const key = process.env.STRIPE_SECRET_KEY;
console.log("Testing Key:", key ? key.substring(0, 10) + "..." : "MISSING");

if (!key) {
    console.error("❌ No STRIPE_SECRET_KEY found in .env");
    process.exit(1);
}

const stripe = new Stripe(key);

async function test() {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Test Product' },
                    unit_amount: 1000,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });
        console.log("✅ Stripe Connection SUCCESS!");
        console.log("Session URL:", session.url);
    } catch (error: any) {
        console.error("❌ Stripe Connection FAILED:", error.message);
    }
}

test();

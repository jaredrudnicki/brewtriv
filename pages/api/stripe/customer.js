const isProd = process.env.NODE_ENV === 'production';
const stripeSecKey = isProd ? process.env.STRIPE_PROD_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY
const stripe = require("stripe")(String(stripeSecKey));


export default async function handler(req, res) {
    try {
        const { email, name } = req.body;

        const customer = await stripe.customers.create({
            email,
            name,
        });

        // Optional but recommended
        // Save the customer object or ID to your database

        res.status(200).json({
            code: 'customer_created',
            customer,
        });

        // if successful add customer id to supabase user
             

    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'customer_creation_failed',
            error: e,
        });
    }
};

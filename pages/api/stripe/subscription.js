const isProd = process.env.NODE_ENV === 'production';
const stripeSecKey = isProd ? process.env.STRIPE_PROD_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
const stripe = require("stripe")(String(stripeSecKey));

const cancelSubscription = async(req, res) => {
    try {
        const { subscriptionId } = req.body;
        
        const deletedSubscription = await stripe.subscriptions.del(
            subscriptionId
        );
        res.status(200).json({
            code: 'subscription_deleted',
            deletedSubscription,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'subscription_deletion_failed',
            error: e,
        });
    }
};

const createSubscription = async(req, res) => {
    try {
        const { customerId } = req.body;

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: "price_1Prju52Ni8rY2fEb933oHuuw"}],
            payment_behavior: 'default_incomplete',
            metadata: {
                // You can save details about your user here
                // Or any other metadata that you would want as reference.
            },
            expand: ['latest_invoice.payment_intent'],
        });

        // Optional but recommended
        // Save the subscription object or ID to your database

        // Send the subscription ID and a client secret that the
        // Stripe subscription API creates. The subscription ID
        // and client secret will be used to
        // complete the payment on the frontend later.
        res.status(200).json({
            code: 'subscription_created',
            subscriptionId: subscription.id,
            clientSecret:
                subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'subscription_creation_failed',
            error: e,
        });
    }
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        await createSubscription(req, res);
    } else if (req.method === "DELETE") {
        await cancelSubscription(req, res);
    }  
};
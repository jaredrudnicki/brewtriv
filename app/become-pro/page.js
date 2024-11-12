"use client";
//const Stripe = require('stripe');

import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { React, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import { getCustomerId, getUser, getProfile, setCustomerId, getSubscriptionId} from "@/utils/actions";
import {Spinner} from "@nextui-org/spinner";



// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const isProd = process.env.NODE_ENV === 'production';
const stripePubKey = isProd ? process.env.STRIPE_PROD_PUBLISHABLE_KEY : process.env.STRIPE_TEST_PUBLISHABLE_KEY;
const stripePromise = loadStripe(String(stripePubKey));

function CheckoutForm({subscriptionId, userId, redirectUrl, quizTitle="", quizDescription=""}) {
    const stripe = useStripe();
    const elements = useElements();
    
  
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
        if (!stripe) {
            return;
        }
  
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
  
        if (!clientSecret) {
            return;
        }
  
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
            case "succeeded":
                setMessage("Payment succeeded!");
                break;
            case "processing":
                setMessage("Your payment is processing.");
                break;
            case "requires_payment_method":
                setMessage("Your payment was not successful, please try again.");
                break;
            default:
                setMessage("Something went wrong.");
                break;
            }
        });
    }, [stripe]);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
  
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
  
        setIsLoading(true);
  
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `http://localhost:3000/checkout-success?subscriptionId=${subscriptionId}&userId=${userId}&redirectUrl=${redirectUrl}&quizTitle=${quizTitle}&quizDescription=${quizDescription}`,
            },
        });
  
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }
  
        setIsLoading(false);
    };
  
    const paymentElementOptions = {
        layout: "tabs",
    };
  
    return (
        <div className="container mx-auto">
            <form id="payment-form" onSubmit={handleSubmit}>
  
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button disabled={isLoading || !stripe || !elements} id="submit" className="p-2 border-2 bg-blue-900 my-1 rounded hover:bg-blue-500">
                    <span id="button-text">
                        {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
    );
}

export default function BecomePro( {params: {redirectUrl, quizTitle="", quizDescription=""}}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    let [subscriptionId, setSubscriptionId] = useState("");
    let [userId, setUserId] = useState("");

    useEffect(() => {
        (async() => {
            // make sure there is a user...
            const user = await getUser();
            let customerId = "";
            let profile = {};
            if (user) {
                setUserId(user.id);
                // create customer if one doesnt exist...
                customerId = await getCustomerId(user.id);
                subscriptionId = await getSubscriptionId(user.id);
                profile = await getProfile(user.id);

                if (customerId === "") {
                    const response = await fetch("/api/stripe/customer", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: profile.first_name + " " + profile.last_name,
                        })
                    }).then(r => r.json());

                    customerId = response.customer.id;

                    //add the customer id to supabase
                    await setCustomerId(user.id, customerId);
                }

                if(subscriptionId === "" || subscriptionId === null) {
                    // Create a subscription as soon as the page loads
                    const subscription = await fetch(`/api/stripe/subscription`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            //   priceId: priceId,
                            customerId: customerId,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            setClientSecret(data.clientSecret);
                            setSubscriptionId(data.subscriptionId);
                        });
                } else {
                    setError("already subscribed");
                }

                
            } else {
                // ask to create an account first
                setError("no user");
            }
            setIsLoading(false);
        })();

        
    }, []);
    const appearance = {
        theme: 'night',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <>
            {!isLoading ? (
                <>
                    {(error === "no user") && (
                        <p>no user</p>
                    )}
                    {(error === "already subscribed") && (
                        <p>already subscribed</p>
                    )}
                    {clientSecret && (
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm subscriptionId={subscriptionId} userId={userId} redirectUrl={redirectUrl} quizTitle={quizTitle} quizDescription={quizDescription}/>
                        </Elements>
                    )}
                </>
            ) : (
                <Spinner />
            )}
        </>
    );
};

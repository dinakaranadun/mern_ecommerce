import asyncHandler from 'express-async-handler'
import Stripe from 'stripe';


const stripe = new Stripe('sk_test_51PiCtyRtQy7daTjtkDRW2beO59DdCG0iMrRq8j6YvtaccGZ9RQOXit8MeLo1SmBXDsJBmqFLxrZJFul4IKACStpt00RBlE6VIf');

const makePaymentIntent = asyncHandler(async(req,res)=>{
    const {amount} = req.body();

    try {
        const paymentIntent = await stripe.PaymentIntentsResource.create({
            amount: Math.round(amount * 100),
            currency:'lkr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });


    } catch (error) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

export {makePaymentIntent};
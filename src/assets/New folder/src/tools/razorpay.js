import logo from "../app/static/images/logo-shape.png";
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export async function displayRazorpay(
    { invoice_id, key, subscription_id },
    user,
    onSuccess,
    onFailure
) {
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        console.log("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // creating a new order
    // call API
    // const result = await axios.post('http://localhost:5000/payment/orders');

    // Getting the order details back
    let prev_invoice_id, razorpay_signature;
    if (invoice_id) {
        prev_invoice_id = invoice_id;
    }
    if (subscription_id) {
        prev_invoice_id = subscription_id;
    }

    const options = {
        key,
        name: "Convin.ai",
        image: logo,
        handler: async function (response) {
            const { razorpay_payment_id, razorpay_signature } = response;
            if (invoice_id) {
                const data = {
                    razorpay_payment_id,
                    razorpay_signature,
                    prev_invoice_id: prev_invoice_id,
                };

                onSuccess(data);
            }
            if (subscription_id) {
                const data = {
                    razorpay_payment_id,
                    razorpay_signature,
                    provider_sub_id: prev_invoice_id,
                };

                onSuccess(data);
            }
        },
        prefill: {
            name: user?.first_name,
            email: user?.email || user?.username,
            contact: user?.primary_phone,
        },
        notes: {
            address: "Feed Forward Technologies",
        },
        theme: {
            color: "#1a62f2",
        },
    };

    if (invoice_id) {
        options.invoice_id = invoice_id;
    }
    if (subscription_id) {
        options.subscription_id = subscription_id;
    }

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
        onFailure(response);
        console.log(response?.error?.code);
        console.log(response?.error?.description);
        console.log(response?.error?.source);
        console.log(response?.error?.step);
        console.log(response?.error?.reason);
        console.log(response?.error?.metadata?.order_id);
        console.log(response?.error?.metadata?.payment_id);
    });
    paymentObject.open();
}

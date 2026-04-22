export function loadPaypalSdk(clientId, currency = "USD") {
  if (!clientId) return Promise.reject(new Error("PayPal client id is missing"));
  if (window.paypal) return Promise.resolve(window.paypal);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-paypal-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&disable-funding=card,credit,paylater,venmo`;
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });
}

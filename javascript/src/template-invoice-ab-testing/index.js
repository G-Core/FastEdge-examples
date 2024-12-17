import Handlebars, { log } from "handlebars";

import { htmlTemplate } from "./htmlTemplate.js";
import { getStyles } from "./cssStyles.js";
import { getLogoBrand } from "./logo.js";

const invoiceData = {
  createdDate: "March 4, 2024",
  dueDate: "April 19, 2024",
  invoiceNumber: "1729",
  recipientAddress: {
    name: "Homer Simpson",
    address1: "742 Evergreen Terrace",
    address2: "Springfield, United States.",
  },
  paymentMethod: "PayPal",
  paymentId: "8915648",
  items: [
    {
      description: "1x Keg of Duff Beer",
      price: 250,
    },
    {
      description: "3x Crate of Duff Beer",
      price: 85,
    },
    {
      description: "2x Duff Footbal Finger",
      price: 20,
    },
  ],
};

const getTotalPrice = (items) =>
  items.reduce((total, item) => total + item.price, 0).toFixed(2);

async function eventHandler({ request }) {
  console.log(
    'Farq: eventHandler -> request.headers.get("ab-test-logo")',
    request.headers.get("ab-test-logo")
  );
  const isAbTestLogo = request.headers.get("ab-test-logo") === "bottle";
  console.log("Farq: eventHandler -> isAbTestLogo", isAbTestLogo);
  const logo = getLogoBrand(isAbTestLogo);

  const abTestFont = request.headers.get("ab-test-font");
  console.log("Farq: eventHandler -> ab-test-font", abTestFont);
  const cssStyles = getStyles(abTestFont);

  const rawHtmlTemplate = htmlTemplate(abTestFont);
  const template = Handlebars.compile(rawHtmlTemplate);

  const html = template({
    cssStyles,
    logo,
    ...invoiceData,
    totalPrice: getTotalPrice(invoiceData.items),
  });

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});

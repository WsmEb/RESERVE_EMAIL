const p = require("playwright");
const mailer = require("nodemailer");
require("dotenv").config();
(async () => {
  const city = "Nador";
  const browser = await p.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.blsspainmorocco.net/mar/home/index");
  await page.waitForTimeout(3000);
  page.$("span > strong").then(async (res) => {
    const destructContent = await res.textContent().then(async (content) => {
      const contentList = content.split(" ");
      if (
        contentList.includes("Casablanca") ||
        contentList.includes(city.toLowerCase()) ||
        contentList.includes(city.toUpperCase())
      ) {
        console.log(true);
        var transport = mailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_KEY,
          },
          html : ` <div>Hello We Want To Informe You that the BLS in Nador </div> `
        });

        var mailOptions = {
          from: process.env.USER_EMAIL,
          to: process.env.TARGET_EMAIL,
          subject: "BLS RENDEZ-VOUS NADOR NOW !!!",
          text: await res.textContent(),
        };

        transport.sendMail(mailOptions);
      }
    });
  });
  await browser.close();
})();

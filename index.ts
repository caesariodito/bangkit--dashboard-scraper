import puppeteer from "puppeteer";
import readline from "readline";

import { Browser, Page } from "puppeteer";

async function login(url: string, page:Page) {
  // Navigate to the login page
  await page.goto(url);
  await page.waitForNavigation();

  // Click the "Sign in with Google" button
  await page.click('xpath=//*[@id="app"]/div/div/button');

  console.log(
    "Please complete the Google sign-in process manually in the new browser window."
  );
  console.log("Press Enter once you have successfully signed in...");

  // Wait for the user to complete the sign-in process manually
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => rl.once("line", resolve));
  rl.close();

  // Optionally, you can verify if the login was successful
  const pageTitle = await page.title();
  console.log("Page Title:", pageTitle);
}

function takeData(page:Page) {
  // select all
  // open each content (show all dipencet until finish)
  // take data
  // preprocess data (another function)
}

function preprocessData(data:any) {}

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: 100,
  }); // Launch a visible browser instance
  const page: Page = await browser.newPage();

  const url = "https://dashboard.bangkit.academy/";

  await login(url, page);
  // await takeData(page);

  // Locate the <select> element
  const selectElement = await page.$("select");

  if (selectElement) {
    // Select all options
    await selectElement.select(
      ...(await selectElement.$$eval("option", (options) =>
        options.map((option) => option.value)
      ))
    );
    console.log("All options selected");
  } else {
    console.log("No <select> element found on the page");
  }

  // Find all buttons
  const allButtons = await page.$$("button");

  // Click buttons with "Show all" text
  for (const button of allButtons) {
    const buttonText = await button.evaluate((button) => button.textContent);
    if (buttonText?.includes("Show all")) {
      await button.click();
    }
  }

  console.log("All 'Show all' buttons clicked");
  // WORKS UNTIL HERE

  // const sectionElement = await page.$$(
  //   "::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2])"
  // );

  // if (sectionElement?.length > 0) {
  //   const divChildren = await sectionElement[0].$$eval("div", (divs: any) =>
  //     divs.map((div: any) => div.outerHTML)
  //   );

  //   console.log("Div Children:", divChildren);
  //   // You can further process or save the div children data as needed
  // } else {
  //   console.log("Section element not found");
  // }

  // const element = await page.waitForSelector(
  //   "::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div/div/div[2]/section[1]/div)"
  // );

  // console.log(element?.getProperties().toString());

  await page.evaluate(() => {
    debugger;
  });

  // await browser.close();
})();

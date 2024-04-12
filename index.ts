import puppeteer from "puppeteer";
import readline from "readline";
import fs from "fs";

import { Browser, Page } from "puppeteer";

interface ProfileData {
  name: string;
  status: string | null;
  attendances: string[];
  progresses: string[];
  assignments: string[];
}

async function login(url: string, page: Page) {
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

function takeData(page: Page) {
  // select all
  // open each content (show all dipencet until finish)
  // take data
  // preprocess data (another function)
}

function formatProfileData(data: ProfileData) {
  const formattedAttendances: { [key: string]: string } = {};
  const formattedProgresses: { [key: string]: string } = {};
  const formattedAssignments: { [key: string]: string } = {};

  // Format attendances
  data.attendances.forEach((attendance) => {
    const [status, ...eventName] = attendance.split(" ");
    const key = eventName.join(" ");
    formattedAttendances[key] = status;
  });

  // Format progresses
  data.progresses.forEach((progress) => {
    const [name, percentageStr] = progress.split(/(\d+%\s*$)/);
    const key = name.trim();
    const value = percentageStr.trim().replace("%", "");
    formattedProgresses[key] = value;
  });

  // Format assignments
  data.assignments.forEach((assignment) => {
    const [status, ...assignmentName] = assignment.split(" ");
    const key = assignmentName.join(" ");
    formattedAssignments[key] = status;
  });

  return {
    name: data.name,
    status: data.status ? data.status : "None",
    formattedAttendances,
    formattedProgresses,
    formattedAssignments,
  };
}

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    // slowMo: 100,
  }); // Launch a visible browser instance
  const page: Page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 1080 });

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

  const allProfiles = await page.$$(
    "::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div)"
  );

  const profileData: ProfileData[] = [];

  console.log("ALL PROFILES");
  for (let i = 0; i < allProfiles.length; i++) {
    const nameXPath = `::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div[${
      i + 1
    }]/div/div[1]/section/div/div/section/div[1]/div[2])`;
    const statusXPath = `::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div[${
      i + 1
    }]/div/div[1]/section/div/div/section/div[2]/div/ul/div/div/div)`;
    const attendancesXPath = `::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div[${
      i + 1
    }]/div/div[2]/section[1]/div/div/div/div[2]/div/div)`;
    const progressesXPath = `::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div[${
      i + 1
    }]/div/div[2]/section[2]/div/div/div/div[2]/div/div)`;
    const assignmentsXPath = `::-p-xpath(/html/body/div/div/div[2]/div/section/section/section[2]/div/div[${
      i + 1
    }]/div/div[2]/section[3]/div/div/div/div[2]/div/div)`;

    const profile = allProfiles[i];
    const name = (await profile.$eval(
      nameXPath,
      (div) => div.textContent
    )) as string;

    let status = null;
    try {
      status = (await profile.$eval(
        statusXPath,
        (div) => div.textContent
      )) as string;
    } catch {
      console.error("No status found");
    }

    const attendances = (await profile.$$eval(attendancesXPath, (divs) =>
      divs.map((div) => div.textContent)
    )) as string[];

    const progresses = (await profile.$$eval(progressesXPath, (divs) =>
      divs.map((div) => div.textContent)
    )) as string[];

    const assignments = (await profile.$$eval(assignmentsXPath, (divs) =>
      divs.map((div) => div.textContent)
    )) as string[];

    // Combine profile data into a single object
    const profileObject: ProfileData = {
      name,
      status,
      attendances,
      progresses,
      assignments,
    };

    console.log("Profile:", i + 1, " - ", name);
    profileData.push(profileObject);
  }

  console.log("All profile data collected");

  // Save profile data to JSON file (error handling included)
  try {
    const fileName = "profile_data.json"; // Customize file name

    // Format the data
    const formattedData = profileData.map(formatProfileData);

    const jsonData = JSON.stringify(formattedData, null, 2); // Pretty-print for readability
    await fs.promises.writeFile(fileName, jsonData);
    console.log(`Profile data saved to: ${fileName}`);
  } catch (error) {
    console.error("Error saving profile data:", error);
  }

  await browser.close();
})();

# Bangkit Dashboard Scraper

A side project to scrape bangkit dashboard website to make my life less burdening. kekw.

Used typescript, bun, puppeteer and exceljs.

Below is a brief intro and the reasons for the tech stack that I chose. **_It's just some personal notes, you don't need to read it tbh._**

Sooo, it's been a busy time for me doing mentoring on bangkit along with other stuff. Unfortunately, I wouldn't be able to keep up with the spreadsheet tracker that I made and shared to my mentees. It's pretty burdening for me to view all the data one by one and make sure everything is up-to-date weekly or even daily – it's just not possible for me.

Then this project came through my mind, I just want to automate things that I can automate and also help my mentees with the tracker (since I share it with them). At the time I developed this side project, I had been neglecting the spreadsheet tracker for almost a month 💀. So yes, I think this is the right move for me, and fortunately, I got some small spare time to develop this project at Eid holiday.

In this side project, I wanted to try new things, hence the stack was created. It was an _alien_ stack for me. **I had never gotten the time to use bun** _(well I once tried it to run laravel breeze project and everything went well so I chose to use it again, since it was fast)_ and **had never used puppetee**r – heck, even I don't know the syntax.

I used to scrape things with python selenium, and moving to puppeteer was pretty uncomfortable for me. But hey, it was an interesting experience for me. I also feel like puppeteer is much more faster compared to selenium _(pleb thoughts, since I haven't dug deep into selenium that much)_. Puppeteer feels like a adult teenager, while selenium feels like an adult LMAOAO.

**Anyways, a small disclaimer:** I used some of AI-generated code to develop this project since I don't know the syntax and mechanism of puppeteer that much. But ofc I read the puppeteer docs, but they were also vague for me, so I need further assistance. **Pardon me if the code is ugly as hell**. I only spent ~a day developing this.

If you want to contribute to this side project as the demands of the spreadsheet tracker grow, feel free to open a PR! But make sure you document it well, tho currently I don't have any guidelines for it.

## The Demo

[![Drive Video](/docs/thumbnail.png)](https://drive.google.com/file/d/1Vm6LOc4BTR1BNAmyknrGwFYgjky16HK2/preview)

## How to Run

This is a step-by-step guide to run this project. Even tho I documented how to use this project starting from the empty folder (via the demo video), but anyways having a text documentation would be convenient too.

### Steps

1. clone the project and cd into it
2. install the package via

   ```bash
   npm install
   # or
   pnpm install
   # or
   ...
   bun install # <-- I use this code, but everything should be working as expected too
   ```

3. run the script via

   ```bash
   bun run start
   # or
   npm run start
   ```

   you can always view or edit the script in the [`package.json`](package.json) file.

4. after you run it, it will open the login page, and asked you to login **manually** via google. you can just type your email and password as usual.

5. after u finish logging in, make sure you wait the page to fully load. it will show the list of available mentees in your class. if everything's good you need to press **Enter** on the terminal to continue the script.

6. it will scrape some of the important data related to the spreadsheet tracker and after it finishes, it will save the output to [`profile_data.json`](example_profile_data.json) file.

7. you are then free to tweak and preprocess the data further. for example, importing the .json file directly to spreadsheet.

8. Optional, I created a script to convert the JSON file into XLSX (Excel), you can access it via `bun run convert` or if you want to modify the script, it is available on the [`convert.ts`](convert.ts) file.

## Future Improvements

- [x] export to excel/csv (soon)
- [ ] integrate with spreadsheet directly via API
- [ ] bypass login with indexedDB (idk really know much about this)
- [ ] create a weekly cron-job to fully automate the tasks

import puppeteer from "puppeteer";
import { PostEntity } from "../types";
import { scrollToBottom } from "./scrollToBottom";

// Scrape post comments from the reddit r/sportsbook tennis thread
const scrapeReddit = async (): Promise<PostEntity[]> => {
  let posts: PostEntity[] = [];

  const url = "https://www.reddit.com/r/sportsbook/";

  try {
    const browser = await puppeteer.launch({
      // headless: false,
    });
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);

    // Go to URL
    await page.goto(url);

    // Might need to scroll a bit to see the Tennis thread
    // await page.waitForSelector("a[href*='tennis_daily_']");
    await page.evaluate(() =>
      document.querySelector("a[href*='tennis_daily_']")?.scrollIntoView()
    );

    await page.waitForSelector("a[href*='tennis_daily_']");

    // Get tennis thread link
    const link = await page.evaluate(() =>
      document.querySelector("a[href*='tennis_daily_']")?.getAttribute("href")
    );

    // Navigate to tennis thread
    if (link) await page.goto(link);

    // Wait for images to load
    await page.waitForSelector("img[alt='User avatar']");

    // Scroll to bottom of page to capture all comments
    await scrollToBottom(page);

    // Keywords to select tipster related comments
    const keywords = ["maize", "corn", "🌽", "🍿", "grain"];
    const tipster = process.env.TIPSTER_USERNAME!;

    // Enable log inside page evaluate
    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      for (let i = 0; i < msgArgs.length; ++i) {
        console.log(await msgArgs[i].jsonValue());
      }
    });

    // Get only comments related to keywords
    let comments = await page.evaluate(
      (keywords, tipster) => {
        return Array.from(document.querySelectorAll(".Comment"), (node) => {
          let message = "";
          let messageHtml = "";

          const commentTags = node.querySelectorAll(
            "div[data-testid='comment'] > div"
          );

          // Concatenate all comments into one
          for (const commentTag of commentTags) {
            message = message + " " + commentTag.textContent;
            messageHtml = messageHtml + " " + commentTag.innerHTML;
          }

          // Get all the remaining comment info
          const platformId = node.parentElement?.id;
          const username = node.querySelector(
            "a[data-testid='comment_author_link']"
          )?.textContent;
          const timestamp = node.querySelector(
            "a[data-testid='comment_timestamp']"
          )?.textContent;
          const likes = node.querySelector(
            "div[id*='vote-arrows'] > div"
          )?.textContent;
          const link = node
            .querySelector("a[data-testid='comment_timestamp']")
            ?.getAttribute("href");
          const image = node
            .querySelector("img[alt*='User avatar']")
            ?.getAttribute("src");

          // Analyze comments & only keep keyword related ones (Maize)
          const isRelated = (keywords as string[]).some((keyword) =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );

          if (isRelated && username !== tipster) {
            return {
              platformId,
              username,
              timestamp,
              message,
              messageHtml,
              likes,
              link,
              image,
              platform: "reddit",
            };
          }
        });
      },
      keywords,
      tipster
    );

    // @ts-ignore
    posts = comments.filter((comment) => comment !== null);

    // Close the browser
    await browser.close();

    return posts;
  } catch (err) {
    console.log(err);
  }

  return posts;
};

export { scrapeReddit };

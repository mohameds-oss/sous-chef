import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const email = `test-${Date.now()}@example.com`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

function log(step) {
  console.log(`✓ ${step}`);
}

try {
  await page.goto(`${BASE}/signup`);
  await page.fill("#name", "Test Cook");
  await page.fill("#email", email);
  await page.fill("#password", "supersecret123");
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/welcome`, { timeout: 10000 });
  log("signup redirects to /welcome");

  await page.goto(`${BASE}/dev/inbox`);
  const inboxText = await page.textContent("body");
  if (!inboxText.includes(email)) throw new Error("verification email not found in dev inbox");
  const verifyLink = await page.getAttribute("a[href*='/verify?token=']", "href");
  if (!verifyLink) throw new Error("verify link not found");
  log("verification email present in dev inbox");

  await page.goto(verifyLink.startsWith("http") ? verifyLink : `${BASE}${verifyLink}`);
  const verifyText = await page.textContent("body");
  if (!verifyText.includes("verified")) throw new Error("verify page did not confirm success");
  log("email verification succeeded");

  await page.goto(`${BASE}/search?ingredients=chicken,garlic,rice`);
  await page.waitForSelector("article");
  const cardCount = await page.locator("article").count();
  if (cardCount === 0) throw new Error("no search results rendered");
  log(`ingredient search rendered ${cardCount} results`);

  const firstRecipeLink = await page.locator("article a").first().getAttribute("href");
  await page.goto(`${BASE}${firstRecipeLink}`);
  await page.waitForSelector("text=Start Cooking");
  log(`recipe detail page loaded: ${firstRecipeLink}`);

  const saveButtons = page.locator('button[aria-pressed]');
  await saveButtons.first().click();
  await page.waitForTimeout(800);
  const pressed = await saveButtons.first().getAttribute("aria-pressed");
  if (pressed !== "true") throw new Error("save button did not toggle to saved");
  log("save recipe toggled on");

  await page.goto(`${BASE}/saved`);
  await page.waitForSelector("article", { timeout: 10000 });
  log("saved recipes page shows the saved recipe");

  const cookHref = firstRecipeLink.replace(/\/$/, "") + "/cook";
  await page.goto(`${BASE}${cookHref}`);
  await page.waitForSelector("text=Step 1 of");
  log("guided cooking mode loaded at step 1");

  await page.click('button:has-text("Next")');
  await page.waitForTimeout(500);
  const stepHeading = await page.textContent("h1");
  if (!stepHeading.includes("Step 2 of") && !stepHeading.includes("You made")) {
    throw new Error(`unexpected heading after clicking next: ${stepHeading}`);
  }
  log("guided cooking next-step navigation works");

  await page.goto(`${BASE}/planner`);
  await page.waitForSelector("text=Monday", { timeout: 10000 });
  log("meal planner page loaded");

  await page.goto(`${BASE}/logout-test-noop`).catch(() => {});

  console.log("\nALL SMOKE CHECKS PASSED");
} catch (err) {
  console.error("SMOKE TEST FAILED:", err.message);
  await page.screenshot({ path: "/tmp/e2e-failure.png" }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}

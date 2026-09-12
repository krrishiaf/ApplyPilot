await page.goto(
  "https://www.lanmea.com/careers/ai-software-engineering-intern",
  { waitUntil: "domcontentloaded" }
);

await page.waitForTimeout(2000);

const recovery = await page.evaluate(() => {

  const buttons = Array.from(
    document.querySelectorAll("button")
  );

  const privacyButton = buttons.find(button => {
    const text = (button.innerText || "").trim().toLowerCase();

    return (
      text.includes("reject all") ||
      text.includes("accept all")
    );
  });

  if (privacyButton) {
    privacyButton.click();

    return {
      detected: true,
      action: "dismissed privacy overlay"
    };
  }

  return {
    detected: false,
    action: "no blocking overlay detected"
  };
});

await page.waitForTimeout(1000);

const result = await page.evaluate(() => {

  const bodyText =
    document.body.innerText || "";

  const index =
    bodyText.toLowerCase().indexOf("how to apply");

  let howToApply = "";

  if (index >= 0) {
    howToApply =
      bodyText.slice(index, index + 2000);
  }

  return {
    title: document.title,
    url: location.href,
    howToApply
  };
});

return {
  ok: true,
  recovery,
  result
};
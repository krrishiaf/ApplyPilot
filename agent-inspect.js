await page.goto(
  "https://www.lanmea.com/careers/ai-software-engineering-intern",
  { waitUntil: "domcontentloaded" }
);

await page.waitForTimeout(3000);

const applicationInfo = await page.evaluate(() => {

  const bodyText = document.body.innerText || "";

  const headings = Array.from(
    document.querySelectorAll("h1, h2, h3, h4")
  )
    .map(el => (el.innerText || "").trim())
    .filter(Boolean);

  const links = Array.from(
    document.querySelectorAll("a")
  )
    .map(el => ({
      text: (el.innerText || "").trim(),
      href: el.href || ""
    }))
    .filter(item => item.text.length > 0);

  const applicationLinks = links.filter(item => {

    const text =
      item.text.toLowerCase();

    const href =
      item.href.toLowerCase();

    return (
      text.includes("apply") ||
      text.includes("application") ||
      text.includes("candidate") ||
      text.includes("join") ||
      href.includes("apply") ||
      href.includes("application")
    );

  });

  const howToApplyIndex =
    bodyText.toLowerCase().indexOf("how to apply");

  let howToApply = "";

  if (howToApplyIndex >= 0) {
    howToApply =
      bodyText.slice(
        howToApplyIndex,
        howToApplyIndex + 2500
      );
  }

  return {

    title: document.title,

    url: location.href,

    headings,

    howToApply,

    applicationLinks

  };

});

return {
  ok: true,
  applicationInfo
};
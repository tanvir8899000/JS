const { chromium } = require('playwright');
const fs = require('fs');

(async() => {
const browser = await chromium.launch({headless: false})
const page = await browser.newPage()
await page.goto('https://www.scrapethissite.com/pages/forms/')

const all = []
let success = 0
let fail = 0
let pageNum = 1
let hasNextPage = true

while(hasNextPage){
  console.log(`--- ${pageNum} --- `)
const contrainer = page.locator('tr.team')
const count = await contrainer.count()

for(let i = 0; i < count; i++){
  const contrainerbox = await contrainer.nth(i)
try {
  const team = await contrainerbox.locator('td.name').textContent()
  const year = await contrainerbox.locator('td.year').textContent()
  const wins = await contrainerbox.locator('td.wins').textContent()
  const losses = await contrainerbox.locator('td.losses').textContent()

  all.push({
   team: team.trim(),
   year: year.trim(),
   wins: wins.trim(),
   losses: losses.trim()
  })
  success++
} catch(error){
  console.log(`Hokey ${pageNum} a issue ${error.message}`)
  fail++
}
}
try {
  await page.locator('a[aria-label="Next"]').click({timeout:3000})
  await page.waitForTimeout(2000)
  pageNum++
} catch(error){
  console.log('scraping finished, no more next page', error.message)
  hasNextPage = false
}
}
fs.writeFileSync('hockey_all.json', JSON.stringify(all,null,2))
console.log(`Totall scraped done ${pageNum}`)
console.log(`successfully scraped ${success}`)
console.log(` Failed scaraped ${fail}`)
await browser.close()
}) ()
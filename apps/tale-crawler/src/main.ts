import { ConfigurationService } from "@tales/shared";
import { TaleCrawler } from "./app/TaleCrawler";

function main() {
  const crawler = new TaleCrawler(new ConfigurationService());

  crawler.init()
  .then(() => crawler.fetch())
  .then(() => {
    console.log('Done');
  });
}

main();
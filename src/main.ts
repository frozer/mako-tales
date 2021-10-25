import { ConfigurationService } from "./services/configuration.service";
import { TaleCrawler } from "./TaleCrawler";

function main() {
  const crawler = new TaleCrawler(new ConfigurationService());

  crawler.init()
  .then(() => crawler.fetch())
  .then(() => {
    console.log('Done');
  });
}

main();
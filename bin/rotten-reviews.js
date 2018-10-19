#!/usr/bin/env node

const ProgressBar = require('progress');
const bar = new ProgressBar('  fetching reviews [:bar] :rate/bps :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 2
  });

const Commander = require('commander')
const Json2CsvParser = require('json2csv').Parser
const RottenReviews = require('..')

const Csv = new Json2CsvParser({
  fields: ['reviewer', 'date', 'stars', 'review'],
})

const description = `Scrapes audience movie or tv show reviews from rotten tomatoes

Examples:
  rotten-reviews venom_2018 100
  rotten-reviews venom_2018 100 --csv
  rotten-reviews doctor_who/s11 10 --tv   (include the season # for tv shows)`

Commander.description(description)
  .option('--csv', 'exports to csv (defaults to json)')
  .option('--tv', 'search as a tv show (defaults to movie)')
  .arguments('<title> <count>')
  .action((title, count) => {
    bar.tick();
    RottenReviews.getAudienceReviews(title, count, Commander.tv)
      .then(reviews => {
        bar.tick();
        console.log(
          Commander.csv ? Csv.parse(reviews) : JSON.stringify(reviews, null, 2)
        )
      })
      .catch(error => {
        console.error(error.message)
      })
  })
  .parse(process.argv)

if (!(Commander.args.length > 0)) Commander.help()

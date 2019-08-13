import logger from '~/src/logger'
import { get } from '~/src/query'
import { parse } from 'node-html-parser'
const Parser = require('rss-parser')

var newsCache = null // this is the cache for news data
var weatherCache = null // this is the cache for weather data
var newsTimeStamp = new Date()
var weatherTimeStamp = new Date()
const maxNewsCache = 15 // Max time to cache the data for (minutes)
const maxWeatherCache = 60 // Max time to cache the data for (minutes)
const disableDescriptions = true // Disable descriptions from news to save space. Enable to get more detailed results.

/**
 *
 * Module for querying weather data and the most important news headlines (along with links?)
 * Caches data so that headlines are fetched only every 15 minutes and weather every 60 minutes.
 *
 * Commands:
 *
 *     /today
 *
 * Data sources:
 *
 * Weather: https://www.foreca.fi/
 * News: https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss
 *
 * @author sampo
 */

export default bot => {
  bot.onText(/\/today(\s.+)?/, async (msg, match) => {
    const chatId = msg.chat.id
    try {
      // *** Fetch news first ***
      if (cacheExists(newsTimeStamp, newsCache, maxNewsCache)) {
        logger.debug('Prev data: ' + newsTimeStamp.getHours() + ':' + newsTimeStamp.getMinutes() + ' -> Fetching new data!')
        newsCache = await queryNews()
        newsTimeStamp = new Date()
      } else {
        logger.debug('Prev data: ' + newsTimeStamp.getHours() + ':' + newsTimeStamp.getMinutes() + ' -> Using cached data!')
      }

      // *** Then fetch the weather info ***
      if (cacheExists(weatherTimeStamp, weatherCache, maxWeatherCache)) {
        logger.debug('Prev data: ' + weatherTimeStamp.getHours() + ':' + weatherTimeStamp.getMinutes() + ' -> Fetching new data!')
        weatherCache = await queryWeather()
        weatherTimeStamp = new Date()
      } else {
        logger.debug('Prev data: ' + weatherTimeStamp.getHours() + ':' + weatherTimeStamp.getMinutes() + ' -> Using cached data!')
      }

      // Form a response message from available data

      var responseMessage = ''
      var newsItem = ''

      for (var i = 0; i < newsCache[0].length; i++) {
        var titleText = newsCache[0][i]
        var descText = newsCache[1][i]
        var linkText = newsCache[2][i]
        if (disableDescriptions) {
          newsItem = titleText + '\n' + '(' + linkText + ')'
        } else {
          newsItem = titleText + '\n===>' + descText + '\n' + '(' + linkText + ')'
        }

        responseMessage += newsItem + '\n==========================\n'
      }

      responseMessage += weatherCache

      if (responseMessage !== '') {
        bot.sendMessage(chatId, responseMessage)
      } else {
        bot.sendMessage(chatId, 'ERROR! No data to send...')
      }
    } catch (error) {
      logger.error(error)
      bot.sendMessage(chatId, 'ERROR! Please see the log for more details.')
    }
  })
  logger.info(`News & Weather module added`)
}

/* Check cache */
const cacheExists = (timestamp, cache, max) => {
  /* Make sure to pass correct values as arguments! */
  var currentTime = new Date().getTime()
  if (currentTime - timestamp.getTime() >= max * 60 * 1000 || cache == null) { // min * s * ms
    return true
  } else {
    return false
  }
}

/* Queries data and parses it */
const queryNews = async () => {
  const parser = new Parser({
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36' },
    customFields: {
      feed: ['description'],
      item: ['description']
    }
  })

  const parsed = await parser.parseURL('https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss')
  var titles = []
  var descriptions = []
  var links = []

  for (var i = 0; i < 3; i++) {
    titles.push(parsed.items[i].title)
    descriptions.push(parsed.items[i].description)
    links.push(parsed.items[i].link.replace('?origin=rss', ''))
  }

  /*
  logger.debug(titles)
  logger.debug(descriptions)
  logger.debug(links)
  */

  return [titles, descriptions, links]
}

/* Data GET */
const getRaw = async urlAddress => {
  try {
    return await get(urlAddress)
  } catch (error) {
    logger.error(error)
  }
}

const queryWeather = async () => {
  const results = await getRaw('https://www.foreca.fi/')
  const parsed = await parse(results.data)
  const weatherData = parsed.firstChild.querySelector('div.textfc')
  return weatherString(weatherData)
}

const weatherString = rawData => {
  const withHeadings = rawData.structuredText.substr(0, rawData.structuredText.indexOf('Lue lisää…')).split('\n')
  return withHeadings[withHeadings.length - 2]
}

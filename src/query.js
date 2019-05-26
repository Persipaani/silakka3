import { stringify } from 'query-string'
import { get as GET } from 'axios'
import logger from '~/src/logger'

/**
 * HTTP get request to given baseUrl with the given query parameters.
 * Expects the query parameters as an object:
 *
 *      {
 *        some: 'parameter',
 *        more: 'stuff'
 *      }
 *
 * The object is then serialized to the request URL:
 *
 * <baseUrl>?some=parameter&more=stuff
 *
 * @param {string} baseUrl
 * @param {Object} queryParams
 *
 * @returns {Promise[Response]}
 */
export const get = async (baseUrl, queryParams) => {
  const url = `${baseUrl}?${stringify(queryParams)}`
  logger.debug(`GET ${url}`)
  return GET(url)
}

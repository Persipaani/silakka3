import { readdirSync } from 'fs'
import { join } from 'path'

/**
 * Finds all module files under 'modules' directory
 * and initializes each of them by passing the bot
 * instance to it.
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
export default async bot => {
  const moduleFiles = readdirSync(join(__dirname, 'modules'))
  await Promise.all(
    moduleFiles.map(async file => {
      const module = await import(`./modules/${file}`)
      module.default(bot)
    })
  )
}

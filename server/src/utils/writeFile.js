import util from 'util'
import fs from 'fs'

const writeFile = util.promisify(fs.writeFile)

export default writeFile

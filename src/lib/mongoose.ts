import config from '@src/config'
import mongoose from 'mongoose'

export const connect = () => {
    let auth = ''
    if (config.database.user && config.database.password) auth = `${config.database.user}:${config.database.password}@`

    return mongoose.connect(`mongodb://${auth}${config.database.host}:${config.database.port}/${config.database.name}`)
}

export default mongoose
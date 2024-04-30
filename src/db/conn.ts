import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI as string

let dbConnection: typeof mongoose

async function connectToDatabase() {
  if (dbConnection) {
    console.log('Já está conectado ao MongoDB.')
    return dbConnection
  }

  try {
    await mongoose.connect(uri)
    console.log('Conectou ao MongoDB com Mongoose')
    dbConnection = mongoose
    return dbConnection
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error)
    throw error
  }
}

(async () => {
  try {
    await connectToDatabase()
    // Seu código aqui que depende da conexão com o banco de dados
  } catch (error) {
    console.error(error)
  }
})()

export default mongoose
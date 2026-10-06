import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
console.log(uri)
if (!uri) throw new Error("MONGODB_URI is not set in .env.local")

if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect()
}

const clientPromise = global._mongoClientPromise
export default clientPromise
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { db, pgClient } from '@/database'
import { env } from '@/env'

// Use TypeScript module augmentation to declare the
// type of server.db to be Drizzle
declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase
  }
}

export interface DrizzlePluginOptions {
  // Specify plugin options here
}

const drizzlePlugin: FastifyPluginAsync<DrizzlePluginOptions> = fp(async (fastify) => {
  // Make Drizzle available through the fastify server instance: server.db
  fastify.decorate('db', db)
  fastify.addHook('onClose', async (_server) => {
    console.info(`Disconnected from database: ${env.DATABASE_URL}`)
    pgClient.end()
  })
})

export default drizzlePlugin

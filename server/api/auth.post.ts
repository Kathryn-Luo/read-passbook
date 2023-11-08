import type { IncomingMessage, ServerResponse } from "http";
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { user } = await readBody(event)

  // @ts-ignore
  event.user = user;

  return { updated: true }
})

import type { FastifyInstance } from "fastify";
import '@fastify/jwt';

export function generateTokens(fastify: FastifyInstance, payload: object) {
  const accessToken = fastify.jwt.sign(payload, { expiresIn: "15m" });
  const refreshToken = fastify.jwt.sign(payload, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

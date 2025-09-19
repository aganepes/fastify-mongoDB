import type { FastifyInstance } from "fastify";
import User from "../models/User.js";
import { generateTokens } from "../utils/auth.js";
import bcrypt from "bcrypt";

export default async function (fastify: FastifyInstance) {
  // Register
  fastify.post("/register",{
      schema: {
        body:{
          type:"object",
          required:['nomber','password'],
          properties: {
            nomber:{ type: 'string' },
            password:{ type: 'string'}
          }
        }
      }
    }, async (req, reply) => {
    const { nomer, password } = req.body as { nomer: string; password: string };

    const userExists = await User.findOne({nomer});
    if(!userExists){
      return reply.status(400).send({message:"User already exists",success:false});
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ nomer, password: hashed });
    await user.save();

    return reply.status(201).send({ message: "User created",success:true });
  });

  // Login
  fastify.post("/login",{
    schema: {
      body:{
        type:"object",
        required:['nomber','password'],
        properties: {
          nomber:{ type: 'string' },
          password:{ type: 'string'}
        }
      }
    }
  },async (req, reply) => {
    const { nomer, password } = req.body as { nomer: string; password: string };

    const user = await User.findOne({ nomer });
    if (!user) return reply.status(401).send({ error: "Invalid credentials",success:false });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return reply.status(401).send({ error: "Invalid credentials",success:false });

    const tokens = generateTokens(fastify, { id: user.id, nomer: user.nomer });
    return reply.send({tokens,success:true });
  });

  // Refresh
  fastify.post("/refresh",{
    schema: {
      body:{
        type:"object",
        required:['refreshToken'],
        properties: {
          refreshToken:{ type: 'string' }
        }
      }
    }
  }, async (req, reply) => {
    const { refreshToken } = req.body as { refreshToken: string };
    if(!refreshToken){
      return reply.status(401).send({ message: 'Refresh token required',success:false });
    }
    try {
      const decoded = fastify.jwt.verify(refreshToken) as any;
      const tokens = generateTokens(fastify, { id: decoded.id, nomer: decoded.nomer });
      return reply.send({tokens,success:true});
    } catch {
      return reply.status(401).send({ error: "Invalid refresh token",success:false });
    }
  });
}

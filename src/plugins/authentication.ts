import type { FastifyInstance, FastifyRequest, FastifyReply,} from 'fastify';
import  FastifyPlugin from 'fastify-plugin';

async function authenticationPlugin(fastify:FastifyInstance) {

  fastify.decorate('authenticate', async function (request:FastifyRequest, reply:FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

}

export default FastifyPlugin(authenticationPlugin);
import type { FastifyInstance, FastifyRequest, FastifyReply,} from 'fastify';
import  FastifyPlugin from 'fastify-plugin';

async function authenticationPlugin(fastify:FastifyInstance) {

  // Auth add to decorator
  fastify.decorate('authenticate', async function (request:FastifyRequest, reply:FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

}

export default FastifyPlugin(authenticationPlugin);

/*
function authenticateToken(request, reply, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return reply.status(401).send({ message: 'Erişim tokenı gerekli' });
    }
    
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return reply.status(403).send({ message: 'Geçersiz token' });
        }
        
        request.user = user;
        next();
    });
}



  fastify.decorate('adminOnly', async function (request:FastifyRequest, reply:FastifyReply) {
    try {
      await request.jwtVerify();
      const user = request.user;
      
      // Admin control
      if (user.role !== 'admin') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Sadece adminler bu işlemi yapabilir'
        });
      }
    } catch (err) {  
      reply.send(err);
    }
  });

*/ 
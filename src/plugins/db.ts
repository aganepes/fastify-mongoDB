// MongoDB bağlantısı
import fastifyPlugin from 'fastify-plugin';
import mongoose from 'mongoose';


export default fastifyPlugin(async (fastify)=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/fastify-mongo");
        fastify.log.info('MongoDB connected.');
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
});
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import db from './plugins/db.js';
import swagger from "./plugins/swagger.js";
import authRoutes from "./routers/auth.js";
import categoryRoutes from "./routers/category.js";
import subCategoryRoutes from "./routers/subCategory.js";
import authentication from './plugins/authentication.js';
import dotenv from 'dotenv';
dotenv.config();

const fastify =Fastify({logger:true});

fastify.register(db);
fastify.register(swagger);
fastify.register(jwt,{secret:process.env.JWT_SECRET || 'Ahmedow'});
fastify.register(authentication);

fastify.register(authRoutes,{prefix:"/auth"});
fastify.register(categoryRoutes);
fastify.register(subCategoryRoutes);

const startServer= async ()=>{
    try {
        await fastify.listen({port:3000});
        fastify.swagger();
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

startServer();
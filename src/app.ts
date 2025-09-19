import fastify from "fastify";
import jwt from "@fastify/jwt";
import db from './plugins/db.js';
import swagger from "./plugins/swagger.js";
import authRoutes from "./routers/auth.js";
import categoryRoutes from "./routers/category.js";
import subCategoryRoutes from "./routers/subCategory.js";
import authentication from './plugins/authentication.js';
import dotenv from 'dotenv';
dotenv.config();

const Fastify =fastify({logger:true});

Fastify.register(db);
Fastify.register(swagger);
Fastify.register(jwt,{secret:process.env.JWT_SECRET || 'Ahmedow'});
Fastify.register(authentication);

Fastify.register(authRoutes,{prefix:"/auth"});
Fastify.register(categoryRoutes);
Fastify.register(subCategoryRoutes);

const startServer= async ()=>{
    try {
        await Fastify.listen({port:3000});
        Fastify.swagger();
    } catch (error) {
        Fastify.log.error(error);
        process.exit(1);
    }
}

startServer();
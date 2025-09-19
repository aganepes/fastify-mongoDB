import dotenv from 'dotenv';
dotenv.config();
import type { FastifyInstance} from "fastify";
import Category from "../models/Category.js";
import type {Name as cateogryName} from "../models/Category.js";

export default async function (fastify: FastifyInstance) {
 
  const categoryLimit  = parseInt(process.env.CATEGORY_LIMIT || '10' ) ;

  fastify.get("/category",{
      schema: {
        querystring: {
          type: 'object',
          required: ['slug_name'],
          properties:{
            slug_name: { type: 'string' },
            page: { type: 'int' }
          }
        }
      }
    }, async (req, reply) => {
    let { slug_name,page } = req.query as { slug_name:string,page:number|any};

    if(!page){
      page = parseInt(page) || 1;
    }
    try {
      const categories = await Category.find({name:{slug:slug_name}}).skip((page - 1) * categoryLimit).limit(categoryLimit);
    
      return reply.status(200).send({ 
        categories,
        currentPage: page,
        totalPages: Math.ceil(categories.length / categoryLimit)
      });
    } catch (error) {
      return reply.status(500).send({error:error.message});
    }
    

  });

  fastify.post("/category",{
    preHandler:[fastify.authenticate],
    schema:{
      body:{
        type:"object",
        required:['name'],
        properties: {
          name: { 
            type: 'object',
            properties:{
              tm:{ type: 'string' },
              ru:{ type: 'string' },
              en:{ type: 'string' },
              slug:{ type: 'string' }
            }
          },
          description: { type: 'string' }
        }
      }
    }
  }, async (req, reply) => {
    const { name, description } = req.body as { name: cateogryName; description: string |undefined };
    try {
        const newCategory = new Category({name,description: description || ''});
        await newCategory.save();
        
        return reply.status(201).send({message:"Category created",success:true });

    } catch (error) {
      return reply.status(500).send({error:error.message});
    }

  });
  fastify.put("/category/:id",{
    preHandler:[fastify.authenticate],
    schema:{
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Category id'
          }
        }
      },
      body:{
        type:"object",
        properties: {
          name: { 
            type: 'object',
            properties:{
              tm:{ type: 'string' },
              ru:{ type: 'string' },
              en:{ type: 'string' },
              slug:{ type: 'string' }
            }
          },
          description: { type: 'string' }
        }
      }
    }
  }, async (req, reply) => {

    const { name, description } = req.body as { name: cateogryName; description: string |undefined };
    const {id} = req.params as {id:string};

    try {
      const category = await Category.findByIdAndUpdate(id,{name,description},{ new: true, runValidators: true });

      if(!category){
        return reply.status(404).send({ error: 'Category not found',success:false });
      }
      
      return reply.status(200).send({message:"Category updated",category,success:true });

    } catch (error) {
      return reply.status(500).send({error:error.message});
    }

  });
}

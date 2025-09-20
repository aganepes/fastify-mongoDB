import dotenv from 'dotenv';
dotenv.config();
import type { FastifyInstance} from "fastify";
import Category from "../models/Category.js";
import type {Name as cateogryName} from "../models/Category.js";

export default async function (fastify: FastifyInstance) {
 
  const categoryLimit  = parseInt(process.env.CATEGORY_LIMIT || '10' ) ;

  fastify.get("/category",{
      schema: {
        summary: 'Get all categories by page',
        querystring: {
          type: 'object',
          properties:{
            slug_name: { type: 'string' },
            page: { type: 'number' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              categories: { 
                type: 'array',
                items:{
                  type: 'object',
                  properties:{
                    id:{type:'string'},
                    name:{
                      type:'object',
                      properties:{
                        tm:{ type: 'string' },
                        ru:{ type: 'string' },
                        en:{ type: 'string' },
                        slug:{ type: 'string' },
                      },
                    },
                    description: { type: 'string' }
                  }
                }
              },
              currentPage: { type: 'number' },
            },
          },
          500:{
            type:'object',
            properties:{
              error:{type:'string'},
              success:{type:'boolean'}
            }
          },
        },
      }
    }, async (req, reply) => {
    let { slug_name,page } = req.query as { slug_name:string|undefined,page:number|undefined};

    if(!page){
      page = parseInt(page) || 1;
    }
    try {
      let categories;

      if(slug_name){
        categories = await Category.find({name:{slug:slug_name}}).skip((page - 1) * categoryLimit).limit(categoryLimit);
      }else{
        categories = await Category.find({}).skip((page - 1) * categoryLimit).limit(categoryLimit);
      }
    
      return reply.status(200).send({ 
        categories,
        currentPage: page
      });

    } catch (error) {
      return reply.status(500).send({error:error.message,success:false});
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
      },
      response:{
        500:{
          type:'object',
          properties:{
            error:{type:'string' },
            success:{type:'boolean'}
          }
        },
        201:{
          type:'object',
          properties:{
            message:{type:'string'},
            success:{type:'boolean'}
          }
        },
      },
    }
  }, async (req, reply) => {
    const { name, description } = req.body as { name: cateogryName; description: string |undefined };
    try {
        const newCategory = new Category({name,description: description || ''});
        await newCategory.save();
        
        return reply.status(201).send({message:"Category created",success:true });

    } catch (error) {
      return reply.status(500).send({error:error.message,success:false});
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
      },
      response:{
        500:{
          type:'object',
          properties:{
            error:{type:'string'},
            success:{type:'boolean'}
          }
        },
        404:{
          type:'object',
          properties:{
            error:{type:'string'},
            success:{type:'boolean'}
          }
        },
        200:{
          type:'object',
          properties:{
            message:{type:'string'},
            success:{type:'boolean'},
            category:{
              type:'object',
              properties: {
                id:{type:'string'},
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
              },
            }
          }
        },
    },
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
      return reply.status(500).send({error:error.message,success:false});
    }

  });
}

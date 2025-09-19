import dotenv from 'dotenv';
dotenv.config();
import type { FastifyInstance} from "fastify";
import SubCategory from "../models/SubCategory.js";
import type { Name } from '../models/Category.js';


export default async function (fastify: FastifyInstance) {

  const categoryLimit  = parseInt(process.env.CATEGORY_LIMIT || '10' ) ;

  fastify.get("/subcategory", async (req, reply) => {
    let { slug_name,page } = req.query as { slug_name:string,page:number|any};

    if(!page){
      page = parseInt(page) || 1;
    }

    const subcategories = await SubCategory.find({name:{slug:slug_name}}).skip((page - 1) * categoryLimit).limit(categoryLimit);
    
    return reply.status(200).send({ 
      subcategories,
      currentPage: page
     });

  });

  fastify.get("/subcategory/:parent_id",{
    schema: {
      querystring: {
        type: 'object',
        properties:{
          parent_id: { type: 'string' }
        }
      }
    }
  }, async (req, reply) => {
  let { parent_id } = req.params as { parent_id:string};

  const subcategories = await SubCategory.find({category_id:parent_id});
  
  return reply.status(200).send({ 
    subcategories,
    category_id: parent_id
    });

  });

  fastify.post("/subcategory",{
    preHandler:[fastify.authenticate],
    schema:{
      body:{
        type:"object",
        required:['name','category_id'],
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
          description: { type: 'string' },
          category_id: { type: 'string'}
        }
      }
    }
  } ,async (req, reply) => {
    const { name, category_id } = req.body as { name: Name; category_id: string };
    
    if(!category_id || !name.slug){
      return reply.status(404).send({message:"SubCategory or slug_name required",success:false });
    }
    try {
       const newSubCategory = new SubCategory({name,category_id});
      await newSubCategory.save();

      return reply.status(200).send({message:"SubCategory created",success:true });

    } catch (error) {
      return reply.status(500).send({error:error.message});
    }
   
  });

  fastify.put("/subcategory/:id",{
    preHandler:[fastify.authenticate],
    schema:{
      querystring: {
        type: 'object',
        properties:{
          id: { type: 'string' }
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
  } ,async (req, reply) => {

    const {id} = req.params as {id:string}
    const { name,description} = req.body as { name: Name,description:string};
    
    try {
      const subCategory = await SubCategory.findByIdAndUpdate(id,{name,description},{ new: true, runValidators: true });

      if(!subCategory){
        return reply.status(404).send({ error: 'SubCategory not found',success:false });
      }
      
      return reply.status(200).send({message:"SubCategory updated",subCategory,success:true });

    } catch (error) {
      return reply.status(500).send({error:error.message});
    }
  });
}

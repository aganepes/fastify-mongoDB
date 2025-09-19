import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import type {Name} from "./Category.js";

interface SubCategory {
  gu_id: string;
  name: Name;
  description:string;
  category_id: Schema.Types.ObjectId;
}

const SubCategorySchema = new Schema<SubCategory>({
  gu_id: { type: String, default: uuidv4 },
  name: { 
    en:{type:String,require:true},
    tm:{type:String,require:true},
    ru:{type:String,require:true},
    slug:{type:String,require:true,unique:true,lowercase:true}
    },
  category_id: { type: Schema.Types.ObjectId, ref:'Category',required: true}
});

export default model<SubCategory>("SubCategory", SubCategorySchema);
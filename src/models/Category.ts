import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Name {
    tm:string;
    ru:string;
    en:string;
    slug:string
}

interface Category {
  id: string;
  name: Name;
  description:string;
}

const CategorySchema = new Schema<Category>({
  id: { type: String, default: uuidv4 },
  name: { 
    en:{type:String,require:true},
    tm:{type:String,require:true},
    ru:{type:String,require:true},
    slug:{type:String,require:true,unique:true,lowercase:true}
    },
  description:String
});

export default model<Category>("Category", CategorySchema);

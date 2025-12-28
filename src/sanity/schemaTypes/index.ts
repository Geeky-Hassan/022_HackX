import {type SchemaTypeDefinition} from "sanity";
import {featureSchema} from "./features";
import {timelineSchema} from "./timeline";
import {teamSchema} from "./team";

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [teamSchema, featureSchema, timelineSchema],
};

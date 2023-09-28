// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Todo, Tag, TodoTags } = initSchema(schema);

export {
  User,
  Todo,
  Tag,
  TodoTags
};
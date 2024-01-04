import 'dotenv/config';
import * as express from 'express';
import { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './Schemas';

const app = express();
const port = process.env.PORT;

console.log('Hello, GraphQl');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.get('/', (req: Request, res: Response) => {
  res.send('<a href="/graphql">Go to the API</a>');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

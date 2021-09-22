const { ApolloServer, gql } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'JUST_FOR_TEST'; // move this to .env

const mongoose = require('mongoose');
const Author = require('./schema/Author');
const Book = require('./schema/Book');
const User = require('./schema/User');

const password = 'fullstackopen2021'; // move this to .env
const database = 'library-app'; // this is database, collection defined by schema
const MONGODB_URI = `mongodb+srv://fullstackopen2021:${password}@fullstackopen2021.nf0gd.mongodb.net/${database}?retryWrites=true&w=majority`;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

// we do not need passwordHash: String! in typeDefs
// bookCount field is not available in db. So, we need resolver
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    favoriteGenre: String
  }
  type Token {
    value: String!
  }
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: [String]): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      password: String!
      name: String!
      favoriteGenre: String
    ): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  // I do not know whether we need try-cacth for the schema validation
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        // https://stackoverflow.com/questions/31357745/find-after-populate-mongoose
        // https://stackoverflow.com/questions/35387837/mongodb-get-object-id-by-finding-on-another-column-value
        // const books = Book.find({
        //   author: args.author,
        // genres: { $in: [args.genre] },
        // });
        // return books;
        // return books.filter(
        //   (b) => b.author === args.author && b.genres.includes(args.genre)
        // );
      }
      if (args.author) {
        // const books = await Book.find({}).populate({
        //   path: 'author',
        //   match: { name: args.author },
        // });
        // const books = await Book.find({ author: args.author });
        // return books;
        // return books.filter((b) => b.author === args.author);
      }
      if (args.genres) {
        const books = await Book.find({
          genres: { $in: [...args.genres] }, // tips: add async await for every find method
        }).populate('author'); // we need to populate() field with ObjectId
        return books;
      }
      return await Book.find({}).populate('author'); // we need to populate() field with ObjectId
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors;
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    // Do not forget to add try-cacth & throw error. Make sure the schema validation in client AND server sides
    addBook: async (root, args, { currentUser }) => {
      // 0 is user authenticated?
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      // 1 save author if not available
      let author = await Author.findOne({ name: args.author }); // author = name from args
      if (!author) {
        author = new Author({ name: args.author }); // make sure the params available

        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }
      // 2 save book
      const book = new Book({ ...args, author: author });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      // 0 is user authenticated?
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      // Option 1:
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;

      // Option 2 (we need to add try-cacth)
      // const author = await Author.findOneAndUpdate(
      //   { name: args.name },
      //   { name: args.name, born: args.setBornTo }, // set new/updated object
      //   { new: true } // return new obeject
      // );
      // return author;
    },
    createUser: async (root, args) => {
      // the concept is convert password to passwordHash. Real password not saved in db
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({
        username: args.username,
        name: args.name,
        passwordHash,
      });
      console.log(user);
      // Option 1
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;

      // Option 2
      // return user.save().catch((error) => {
      //   throw new UserInputError(error.message, {
      //     invalidArgs: args,
      //   });
      // });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) }; // value as defined typeDefs
    },
  },
  Author: {
    bookCount: async (root) => {
      // const count = await Book.countDocuments({author})
      // const count = books.filter((b) => b.author === root.name);
      // return count.length;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id); // we can populate() here
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { users } from "../mock-data/users";
import { UserType } from "./TypeDefs/UserType";

// const users = allUsers.map(user => user.isDeleted = false);

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: {},
            resolve(parent, args) {
                return users.filter(user => user.isDeleted === false);
            }
        },
        getAllUsersAdmin: {
            type: new GraphQLList(UserType),
            args: {},
            resolve(parent, args) {
                return users;
            }
        },
        getUserById: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return users.find(user => user.id === args.id);
            }
        },
        getUserByName: {
            type: new GraphQLList(UserType),
            args: { 
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
             },
             resolve(parent, args) {
                return users.filter(user => user.firstName === args.firstName || user.lastName === args.lastName);
             }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                isDeleted: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                const newUser = {
                    id: users.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: args.password,
                    isDeleted: args.isDeleted,
                };
                users.push(newUser);
                return newUser;
            }
        },
        updateUser: {
            type: UserType,
            args: { 
                id: { type: GraphQLInt },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id);

                if (!user) {
                    return null;
                }

                const { id, firstName, lastName, email, password } = args;
                
                user.firstName = firstName || user.firstName;
                user.lastName = lastName || user.lastName;
                user.email = email || user.email;
                user.password = password || user.password;

                users[id] = user;
                return user;
            }
        },
        softDeleteUser: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                const userToDelete = users.findIndex(user => user.id == args.id);
                users[userToDelete].isDeleted = true;
                return users[userToDelete];
            }
        }
    }
});

export const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation});


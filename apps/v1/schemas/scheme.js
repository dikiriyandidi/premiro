const mysql = require('mysql');
let { graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

let connect = (connection) => new Promise((resolve, reject) => {
    connection.connect((err) => {
        if (err)
            reject(err)
        else
            resolve(null)
    })
});

let query = (connection, query_str, param) => new Promise((resolve, reject) => {
    // console.log(query_str, param);
    let query = connection.query(query_str, param, (err, rows, fields) => {
        if (err)
            reject(err)
        else {
            let _fields = []
            for (let i in fields) {
                _fields.push(fields[i].name)
            }
            // resolve({
            //     err: err,
            //     rows: rows,
            //     fields: _fields
            // })
            resolve(rows);
        }
    });
    console.log(query.sql);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'starter_db'
});
connect(connection);

var admin = new GraphQLObjectType({
    name: 'admin',
    fields: {
        id: {
            type: GraphQLInt,
            resolve(obj) {
                return obj.id
            }
        },
        email: {
            type: GraphQLString,
            resolve(obj) {
                return obj.email
            }
        },
        fullname: {
            type: GraphQLString,
            resolve(obj) {
                return obj.fullname
            }
        },
        password: {
            type: GraphQLString,
            resolve(obj) {
                return obj.password
            }
        },
        created_date: {
            type: GraphQLInt,
            resolve(obj) {
                return obj.created_date
            }
        },
        last_login: {
            type: GraphQLInt,
            resolve(obj) {
                return obj.last_login
            }
        },
        status: {
            type: GraphQLString,
            resolve(obj) {
                return obj.status
            }
        },
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMasterStatusCompletion: {
            type: admin,
            args: 
            {
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                fullname: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(root, args) {
                return query(connection, "INSERT INTO admin(email, fullname, password, created_date) VALUES(?,?,?,FROM_UNIXTIME(?))",[args.email, args.fullname, args.password, (new Date()).getTime()])
            }
        },
        editMasterStatusCompletionById: {
            type: admin,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                fullname: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(root, args) {
                return query(connection, "UPDATE admin set email = ?, fullname = ?, password = ? where id = ?",[args.email, args.fullname, args.password, args.id]);
            }
        }
    }
})

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'StarterDB',
        fields: {
            admin: {
                type: new GraphQLList(admin),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    },
                    fullname: {
                        type: GraphQLString
                    },
                    password: {
                        type: GraphQLString
                    },
                    created_date: {
                        type: GraphQLInt
                    },
                    last_login: {
                        type: GraphQLInt
                    },
                    status: {
                        type: GraphQLString
                    },
                },
                resolve() {
                    return query(connection, "select * from admin");
                }
            }
        }
    }),
    mutation
});

module.exports = schema
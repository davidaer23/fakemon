const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
// Models
const Fakemon = require('./models/fakemon')
const Move = require('./models/move')
const moveDamageClass = require('./models/moveDamageClass')
const MoveDamageClass = require('./models/moveDamageClass')
const Type = require('./models/type')


// Conection
const MONGO_URI = 'mongodb+srv://david102:david102@cluster0.oyegz.mongodb.net/Fakemon-db?retryWrites=true&w=majority'

console.log('connecting to ', MONGO_URI)

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB: ', error.message)
    })



    
const typeDefs = gql`
    type Type {
        name: String!
        no_damage_to: [Type!]
        half_damage_to: [Type!]
        double_damage_to: [Type!]
        no_damage_from: [Type!]
        half_damage_from: [Type!]
        double_damage_from: [Type!]
        color: String!
        id: ID!
    }

    type MoveDamageClass {
        name: String!
        description: String!
        image: String!
        id: ID!
    }

    type Move {
        name: String!
        accuracy: Int!
        pp: Int!
        priority: Int!
        power: Int!
        type: Type!
        damage_class: MoveDamageClass!
        id: ID!
    }

    type Fakemon {
        name: String!
        height: Float!
        weight: Float!
        moves: [Move!]!
        types: [Type!]!
        attack: Int!
        defense: Int!
        special_attack: Int!
        special_defense: Int!
        speed: Int!
        hp: Int!
        image: String!
        id: ID!
    }

    type Query {
        allFakemons(name: String, order: String, asc: Int, type: String, move: String): [Fakemon!]!
        allMoves(name: String, damageClass: String, order: String, asc: Int): [Move!]!
        allMovesDC: [MoveDamageClass!]!
        allTypes(name: String): [Type!]!
    }

    type Mutation {
        addFakemon(
            name: String!
            height: Float!
            weight: Float!
            moves: [String]!
            types: [String]!
            attack: Int!
            defense: Int!
            special_attack: Int!
            special_defense: Int!
            speed: Int!
            hp: Int!
            image: String!
        ): Fakemon
        
        addMove(
            name: String!
            accuracy: Int!
            pp: Int!
            priority: Int!
            power: Int!
            type: String!
            damage_class: String!
        ): Move

        addMoveDC(
            name: String!
            description: String!
            image: String!
        ): MoveDamageClass

        addType(
            name: String!
            no_damage_to: [String!]
            half_damage_to: [String!]
            double_damage_to: [String!]
            no_damage_from: [String!]
            half_damage_from: [String!]
            double_damage_from: [String!]
            color: String!
        ): Type

        editType(
            name: String!
            no_damage_to: [String!]
            half_damage_to: [String!]
            double_damage_to: [String!]
            no_damage_from: [String!]
            half_damage_from: [String!]
            double_damage_from: [String!]
        ): Type

        editFakemon(
            name: String!
            height: Float
            weight: Float
            moves: [String]
            types: [String]
            attack: Int
            defense: Int
            special_attack: Int
            special_defense: Int
            speed: Int
            hp: Int
            image: String
        ): Fakemon

        deleteFakemon(
            name: String!
        ): Fakemon
        deleteType(
            name: String!
        ): Type
        deleteMove(
            name: String!
        ): Move
    }

`

const typeDamage = async ( arrayType ) =>{
    const resultType = await Type.find({_id:{ $in: arrayType}})
    return resultType.map(d => {return d._doc})
}


const resolvers = {
    Query: {

        allFakemons: async (root, args) => {
            // Filtrar por nombre y ordenar por cualquier atributo
            let ord=1
            let atr='_id'
            if(args.name){
                return Fakemon.find({name: args.name})
            }
            if(args.type){
                const type = await Type.findOne({name: args.type})
                return Fakemon.find({"types": type._id})
            }
            if(args.move){
                const move = await Move.findOne({name: args.move})
                return Fakemon.find({"moves": move._id})
            }

            if(args.order){
                atr=args.order
            }
            if(args.asc){
                ord=args.asc
            }
            


            return Fakemon.find({}).sort({atr: ord})
        },
  
        allMoves: async (root, args) => {
            // Filtrar por nombre y damageclass
            let ord=1
            let atr='_id'

            
            if(args.name){
                return Move.find({name: args.name})
            }

            if(args.damageClass){
                const moveDC = await moveDamageClass.findOne({name: args.damageClass})
                return Move.find({damage_class: moveDC._id})
            }

            if(args.order){
                atr=args.order
            }
            if(args.asc){
                ord=args.asc
            }
            
            let sort ={}
            sort[atr]= ord

            return  Move.find({}).sort(sort)
        },

        allMovesDC: async () => MoveDamageClass.find({}),

        allTypes: async (root, args) => {
            // Filtrar por nombre
            if(!args.name){
                return Type.find({}).sort({name: 1})
            }
            
            return Type.find({name: args.name})
        }

    },


    Fakemon: {
        moves: async (root) => {
            const moves = await Move.find({_id:{ $in: root.moves}})
            return moves.map(d => {return d._doc})
        },
        types: async (root) => typeDamage(root.type)

    },

    Type: {
        no_damage_to: async (root) => typeDamage(root.no_damage_to),
        half_damage_to: async (root) => typeDamage(root.half_damage_to),
        double_damage_to: async (root) => typeDamage(root.double_damage_to),
        no_damage_from: async (root) => typeDamage(root.no_damage_from),
        half_damage_from: async (root) => typeDamage(root.half_damage_from),
        double_damage_from: async (root) => typeDamage(root.double_damage_from)
    },

    Move: {
        damage_class: async (root) => {
            const moveDC =  await moveDamageClass.findOne({_id: root.damage_class})
            return moveDC._doc
        },
        type: async (root) => {
            const type = await Type.findOne({_id: root.type})
            return type._doc
        }
    },

    Mutation: {
        // Fakemon
        addFakemon: async (root, args) => {
            const fakemon = new Fakemon({...args})

            const moves = await Move.find({name:{$in:args.moves}})
            fakemon.moves=[...moves]
            const types = await Type.find({name:{$in:args.types}})
            fakemon.types=[...types]

            try {
                await fakemon.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

            return fakemon
        },

        // Moves
        addMove: async (root, args) => {
            const move = new Move({...args})

            move.type = await Type.findOne({name: args.type})
            move.damage_class = await moveDamageClass.findOne({name: args.damage_class})

            try {
                await move.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

            return move
        },

        // MoveDC
        addMoveDC: async (root, args) => {
            const moveDC = new MoveDamageClass({...args})

            try {
                await moveDC.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
                
            }

            return moveDC
        },

        // Types
        addType: async (root, args) => {
            const type = new Type({...args})

            if(args.no_damage_to){
                const noDamageTo = await Type.find({name:{$in:args.no_damage_to}})
                type.no_damage_to=[...noDamageTo]
            }
            
            // half damage to
            if(args.half_damage_to){
                const halfDamageTo = await Type.find({name:{$in:args.half_damage_to}})
                type.half_damage_to=[...halfDamageTo]
            }

            // double damage to
            if(args.double_damage_to){
                const doubleDamageTo = await Type.find({name:{$in:args.double_damage_to}})
                type.double_damage_to=[...doubleDamageTo]
            }

            // no damage from
            if(args.no_damage_from){
                const noDamageFrom = await Type.find({name:{$in:args.no_damage_from}})
                type.no_damage_from=[...noDamageFrom]
            }
            
            // half damage to
            if(args.half_damage_from){
                const halfDamageFrom = await Type.find({name:{$in:args.half_damage_from}})
                type.half_damage_from=[...halfDamageFrom]
            }

            // double damage to
            if(args.double_damage_from){
                const doubleDamageFrom = await Type.find({name:{$in:args.double_damage_from}})
                type.double_damage_from=[...doubleDamageFrom]
            }
            

            try {
                await type.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

            return type
        },

        editType: async (root, args) => {
            const type = await Type.findOne({name: args.name})
            // no damage to
            if(args.no_damage_to){
                const noDamageTo = await Type.find({name:{ $in: args.no_damage_to}})
                type.no_damage_to=[...noDamageTo]
            }
            
            // half damage to
            if(args.half_damage_to){
                const halfDamageTo = await Type.find({name:{$in:args.half_damage_to}})
                type.half_damage_to=[...halfDamageTo]
            }

            // double damage to
            if(args.double_damage_to){
                const doubleDamageTo = await Type.find({name:{$in:args.double_damage_to}})
                type.double_damage_to=[...doubleDamageTo]
            }

            // no damage from
            if(args.no_damage_from){
                const noDamageFrom = await Type.find({name:{$in:args.no_damage_from}})
                type.no_damage_from=[...noDamageFrom]
            }
            
            // half damage to
            if(args.half_damage_from){
                const halfDamageFrom = await Type.find({name:{$in:args.half_damage_from}})
                type.half_damage_from=[...halfDamageFrom]
            }

            // double damage to
            if(args.double_damage_from){
                const doubleDamageFrom = await Type.find({name:{$in:args.double_damage_from}})
                type.double_damage_from=[...doubleDamageFrom]
            }
            
            try {
                await type.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return type
        },
        editFakemon: async (root, args) => {
            const fakemon = await Fakemon.findOne({name: args.name})
            
            if(args.height){
                fakemon.height=args.height
            }
            if(args.weight){
                fakemon.weight=args.weight
            }
            
            if(args.moves){
                const moves = await Move.find({name:{$in:args.moves}})
                fakemon.moves=[...fakemon.moves,...moves]
            }
            if(args.types){
                const types = await Type.find({name:{$in:args.types}})
                fakemon.types=[...fakemon.types,...types]
            }
            
            if(args.attack){
                fakemon.attack=args.attack
            }
            if(args.defense){
                fakemon.defense=args.defense
            }
            if(args.special_attack){
                fakemon.special_attack=args.special_attack
            }
            if(args.special_defense){
                fakemon.special_defense=args.special_defense
            }
            if(args.speed){
                fakemon.speed=args.speed
            }
            if(args.hp){
                fakemon.hp=args.hp
            }
            if(args.image){
                fakemon.image=args.imge
            }
            
            
            try {
                await fakemon.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return fakemon
        },
        deleteFakemon: async (root, args) => await Fakemon.findOneAndDelete({name: args.name}),
        deleteType: async (root, args) => await Type.findOneAndDelete({name: args.name}),
        deleteMove: async (root, args) => await Move.findOneAndDelete({name: args.name}),
        
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
import { gql } from "apollo-server-micro";

export const CAR_QUERY = gql`
  query Car {
    car {
      brand
      description
      id
      image
      name
      stock
      price
    }
  }
`;

export const CART_QUERY = gql`
  query Transaction($id: String!) {
    transaction(id: $id) {
      id
      user_id
      amount
      car {
        name
        id
        brand
        price
        image
      }
    }
  }
`;

export interface CartQuery {
  id: string;
  user_id: string;
  amount: number;
  car: {
    name: string;
    id: string;
    brand: string;
    price: number;
    image: string;
  };
}

export const ADD_CART = gql`
  mutation Mutation($carId: String!, $amount: Int!, $username: String!) {
    addTransaction(car_id: $carId, amount: $amount, username: $username)
  }
`;

export const DEL_CART = gql`
  mutation Mutation($deleteTransactionId: String!) {
    deleteTransaction(id: $deleteTransactionId)
  }
`;

export const AMOUNT_TANSACTION = gql`
  mutation Mutation(
    $amountTransactionId: String!
    $amount: Int!
    $isIncrement: Boolean!
  ) {
    amountTransaction(
      id: $amountTransactionId
      amount: $amount
      isIncrement: $isIncrement
    )
  }
`;

export const ADD_TO_CHECKOUT = gql`
  mutation Mutation(
    $total: Int!
    $tanggal: String!
    $provinsi: String!
    $kota: String!
    $alamat: String!
    $kodepos: String!
    $userId: String!
    $transactionIds: [String!]!
  ) {
    addToCheckout(
      total: $total
      tanggal: $tanggal
      provinsi: $provinsi
      kota: $kota
      alamat: $alamat
      kodepos: $kodepos
      user_id: $userId
      transaction_ids: $transactionIds
    )
  }
`;

export const USER_QUERY = gql`
query Query {
  user {
    id
    username
    email
    phone
  }
}
`

export const CREATE_USER = gql`
  mutation Mutation(
    $name: String!
    $password: String!
    $email: String!
    $phone: String!
  ) {
    createUser(name: $name, password: $password, email: $email, phone: $phone)
  }
`;

export const DELETE_USER = gql`
mutation Mutation($id: String!) {
  deleteUser(id: $id)
}
`

export const FIND_CAR = gql`
  query CarById($id: String!) {
    carById(id: $id) {
      id
      name
      brand
      description
      image
      price
      stock
    }
  }
`;

export const CREATE_CAR = gql`
  mutation Mutation(
    $name: String!
    $brand: String!
    $desc: String!
    $price: Int!
    $stock: Int!
    $image: String!
  ) {
    createCar(
      name: $name
      brand: $brand
      desc: $desc
      price: $price
      stock: $stock
      image: $image
    )
  }
`;

export const DELETE_CAR = gql`
  mutation Mutation($id: String!) {
    deleteCar(id: $id)
  }
`;

export const EDIT_CAR = gql`
  mutation Mutation(
    $id: String!
    $name: String!
    $brand: String!
    $desc: String!
    $price: Int!
    $stock: Int!
    $image: String!
  ) {
    editCar(
      id: $id
      name: $name
      brand: $brand
      desc: $desc
      price: $price
      stock: $stock
      image: $image
    )
  }
`;

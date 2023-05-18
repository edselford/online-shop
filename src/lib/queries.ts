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
  query Transaction($username: String!) {
    transaction(username: $username) {
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

export const SAVE_TO_HISTORY = gql`
  mutation Mutation(
    $total: Int!
    $tanggal: String!
    $transactionIds: [String!]!
  ) {
    saveToHistory(
      total: $total
      tanggal: $tanggal
      transaction_ids: $transactionIds
    )
  }
`;

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

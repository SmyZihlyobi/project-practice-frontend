import { gql } from '@apollo/client';

export const CREATE_COMPANY_MUTATION = gql`
  mutation MyMutation {
    createCompany(
      input: {
        name: "fdfd"
        representative: "fdf"
        email: "drankov.alex@yandex.ru"
        contacts: "fdf"
        studentCompany: false
      }
    ) {
      id
    }
  }
`;

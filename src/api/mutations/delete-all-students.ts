import { gql } from '@apollo/client';

export const DELETE_ALL_STUDENTS_MUTATION = gql`
  mutation deleteAllStudents {
    deleteAllStudents
  }
`;

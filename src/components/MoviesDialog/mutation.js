import { gql } from 'apollo-boost'

export const deleteMovieMutation = gql`
  mutation addMovie($id: ID) {
    deleteMovie(id: $id) {
      id
    }
  }
`

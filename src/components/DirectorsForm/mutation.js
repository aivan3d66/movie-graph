import { gql } from 'apollo-boost'

export const addDirectorMutation = gql`
    mutation addDirector($name: String!, $age: Itn!) {
        addDirector(name: $name, age: $age) {
            name
        }
    }
`

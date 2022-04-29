import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { deleteMovieMutation } from './mutation'
import { moviesQuery } from '../MoviesTable/queries'

const withGraphqlAdd = graphql(deleteMovieMutation, {
    props: ({ mutate }) => ({
        deleteMovie: id => mutate({
            variables: id,
            refetchQueries: [{ query: moviesQuery }],
        }),
    }),
});

export default compose(withGraphqlAdd);

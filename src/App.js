import React, { Component } from 'react'
import Tabs from './components/Tabs/Tabs'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import theme from './components/theme'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: 'http://localhost:3005/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    movie: {
                        merge(existing, incoming) {
                            return incoming;
                        }
                    },
                    movies: {
                        merge(existing, incoming) {
                            return incoming;
                        }
                    },
                    director: {
                        merge(existing, incoming) {
                            return incoming;
                        }
                    },
                    directors: {
                        merge(existing, incoming) {
                            return incoming;
                        }
                    },

                },
            },
        },
    }),
})

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <MuiThemeProvider theme={theme}>
                    <Tabs />
                </MuiThemeProvider>
            </ApolloProvider>
        )
    }
}

export default App

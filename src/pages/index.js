import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Card from "../components/card"

export default function Home({ data }) {
  const { jsonGraphQlServer } = data
  return (
    <Layout>
      <h1>{data.site.siteMetadata.title}</h1>
      {jsonGraphQlServer.allAnimals.map(animal => {
        return <Card key={animal.id} {...animal} />
      })}
    </Layout>
  )
}

export const query = graphql`
  query {
    jsonGraphQlServer {
      allAnimals {
        id
        name
        type
        diet
        isExtinct
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { client, linkResolver } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Preview = ({ token }) => {
  const router = useRouter()

  useEffect(() => {
    client.previewSession(token, linkResolver, '/').then((url) => router.push(url))
  })

  return null
}

Preview.getInitialProps = ({ query: { token, documentId } }) => {
  return { token, documentId }
}

export default Preview
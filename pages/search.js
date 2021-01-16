import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import Link from 'next/link'
import Imgix from 'react-imgix'
import Gallery from 'react-photo-gallery'
import { TextHeader } from 'components'

const executeSearch = async (query) => {
  if (!query || query === '') return []

  const { results } = await client.query(
    [Prismic.Predicates.at('document.type', 'sketchplanation'), Prismic.Predicates.fulltext('document', query)],
    {
      pageSize: 100,
    }
  )

  return results
}

const mapResultsToImages = (results) => {
  try {
    return results.map(({ uid, data: { title, image: { url, alt, dimensions: { width, height } } } }) => ({
      src: url,
      width,
      height,
      alt: alt || `${title} - Sketchplanations`,
      uid,
    }))
  } catch {
    console.log('Something went wrong:', results)
    return []
  }
}

const Search = ({ ssrResults, ssrSearchCalled }) => {
  const router = useRouter()
  const [searchCalled, setSearchCalled] = useState(ssrSearchCalled)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState(router?.query?.q || '')
  const [images, setImages] = useState(ssrResults ? mapResultsToImages(ssrResults) : [])

  const runSearch = async (e) => {
    e.preventDefault()

    if (!query || query === '') return

    setIsSearching(true)
    const searchResults = await executeSearch(query)
    router.replace({
      pathname: '/search',
      query: { q: encodeURI(query) },
    })
    setSearchCalled(true)
    setImages(mapResultsToImages(searchResults))
    setIsSearching(false)
  }

  const renderImage = ({ photo }) => {
    return (
      <Link key={photo.uid} href={`/${photo.uid}`}>
        <a>
          <Imgix
            className='lazyload'
            src={photo.src}
            attributeConfig={{
              src: 'data-src',
              srcSet: 'data-srcset',
              sizes: 'data-sizes',
            }}
            htmlAttributes={{
              src: `${photo.src}&w=400&blur=200&px=16`,
              style: { margin: 16, display: 'block' },
              width: photo.width,
              height: photo.height,
            }}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
          />
        </a>
      </Link>
    )
  }

  return (
    <>
      <div className='root'>
        {/* <TextHeader className='text-center'>Search results</TextHeader> */}
        <form className='search-form' onSubmit={runSearch}>
          <input
            className='query-input'
            type='text'
            placeholder='Type to search…'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={`submit-button ${query && query !== '' && 'is-active'}`} type='submit'>
            {isSearching ? (
              <svg className='search-loading-icon' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            ) : (
              <svg className='search-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z' />
              </svg>
            )}
          </button>
        </form>
        {searchCalled && images.length > 0 && (
          <div className='gallery'>
            <Gallery photos={images} direction='row' margin={16} targetRowHeight={400} renderImage={renderImage} />
          </div>
        )}
        {searchCalled && images.length === 0 && (
          <div className='no-results'>
            <TextHeader className='text-center'>No results</TextHeader>
          </div>
        )}
      </div>
      <style jsx>
        {`
          .root {
            @apply pt-8 pb-20 mx-auto;
          }

          .gallery {
            @apply overflow-hidden;
          }

          .gallery :global(.react-photo-gallery--gallery) {
            margin: -16px;
          }

          @screen sm {
            .gallery :global(.react-photo-gallery--gallery) {
              margin: 16px;
            }
          }

          .gallery :global(img) {
            max-width: 570px;
          }

          .gallery :global(.react-photo-gallery--gallery > *) {
            justify-content: center;
          }

          .search-form {
            @apply mx-auto px-4 mb-8 flex flex-row;
            max-width: 28rem;
          }

          @screen sm {
            .search-form {
              @apply mb-0;
            }
          }

          .query-input {
            @apply block py-3 px-6 w-full bg-white rounded-full rounded-r-none border border-r-0 outline-none flex-grow text-lg;
          }

          .query-input:focus,
          .query-input:focus ~ .submit-button {
            @apply border-blue;
          }

          .submit-button {
            @apply px-6 text-black border border-l-0 rounded-full rounded-l-none;
          }

          .query-input:focus ~ .submit-button.is-active {
            @apply text-blue;
          }

          .submit-button svg {
            width: 1rem;
            height: auto;
          }

          .search-icon {
            fill: currentColor;
            opacity: 0.38;
            transition: opacity 0.2s;
          }

          .query-input:focus ~ .submit-button.is-active > .search-icon {
            opacity: 1;
          }

          .no-results {
            @apply pt-20;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .search-loading-icon {
            @apply text-blue;
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </>
  )
}

Search.getInitialProps = async ({ query }) => {
  const results = await executeSearch(query.q)

  return { ssrResults: results, ssrSearchCalled: query?.q ? true : false }
}

export default Search
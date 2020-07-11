import Head from 'next/head'
import React from 'react'
import Headroom from 'react-headroom'

import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  const pageTitle = 'Sketchplanations - A weekly explanation in a sketch'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property='og:title' content={pageTitle} key='title' />
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap' rel='stylesheet' />
      </Head>
      <Headroom>
        <div className='header'>
          <div className='inline-flex flex-col sm:flex-row items-center justify-center lg:justify-start flex-wrap lg:flex-no-wrap -m-1 sm:-m-3 flex-grow'>
            <div className='p-1 sm:p-3'>
              <div className='ident'>
                <img className='ident__svg' src='/logo.svg' alt='Sketchplanations' />
              </div>
            </div>
            <div className='p-1 sm:p-3'>
              <p className='slogan'>Explaining one thing a week in a sketch</p>
            </div>
          </div>
          <nav className='whitespace-no-wrap'>
            <a href=''>About</a>
            <a href=''>Archive</a>
            <a href=''>Patreon</a>
            <a href=''>Subscribe</a>
          </nav>
        </div>
      </Headroom>
      <Component {...pageProps} />
      {/* <a href='' className='patreon'>
        <img width={108.5} height={25.5} src='https://c5.patreon.com/external/logo/become_a_patron_button.png' />
      </a> */}
      <style jsx>{``}</style>
    </>
  )
}
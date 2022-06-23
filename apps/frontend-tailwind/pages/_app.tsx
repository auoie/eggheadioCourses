import '../styles/globals.css';
import favicon from '../assets/favicon.ico';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '../components/Navbar.tsx';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider disableTransitionOnChange attribute="class">
      <Head>
        <title>egghead.io Courses</title>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static override async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  override render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-zinc-200 dark:bg-zinc-950">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

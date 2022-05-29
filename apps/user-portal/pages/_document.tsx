import Document, { Html, Head, NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }: any) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(
      // eslint-disable-next-line react/display-name
      (App: any) => (props: any) => sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en-AU">
        <link rel="icon" href="/static/favicon.png" />
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

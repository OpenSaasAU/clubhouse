import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import Router from 'next/router';
import '../components/styles/nprogress.css';
import { SessionProvider } from 'next-auth/react';
import { Page } from '../components/theme/Page';
import { useApollo } from '../lib/form/apolloClient';
import '../components/styles/bootstrap.min.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const apollo = useApollo(pageProps);
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ApolloProvider client={apollo}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }: any) {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default MyApp;

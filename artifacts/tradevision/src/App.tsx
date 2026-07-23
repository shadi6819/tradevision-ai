import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Binary from '@/pages/Binary';
import Forex from '@/pages/Forex';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-white mb-4 text-glow">404</h1>
        <p className="text-lg text-muted-foreground">
          System telemetry lost. This sector does not exist.
        </p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/binary" component={Binary} />
        <Route path="/forex" component={Forex} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

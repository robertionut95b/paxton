import AppProviders from "@app/AppProviders";
import RoutesProvider from "@app/router";

function App() {
  return (
    <div id="px-app">
      <AppProviders>
        <RoutesProvider />
      </AppProviders>
    </div>
  );
}

export default App;

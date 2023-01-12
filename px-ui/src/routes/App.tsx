import AppProviders from "@providers/AppProviders";
import AppUI from "./AppUi";

function App() {
  return (
    <div id="px-app">
      <AppProviders>
        <AppUI />
      </AppProviders>
    </div>
  );
}

export default App;

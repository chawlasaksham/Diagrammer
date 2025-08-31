import { BrowserRouter } from "react-router-dom";
import ContextToolbar from "components/ui/ContextToolbar";
import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> removed */}
      <ContextToolbar />
      <main>
        <Routes />
      </main>
    </BrowserRouter>
  );
}
export default App;

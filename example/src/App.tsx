import { CrispyToaster } from "../../src";
import { DispatchButton } from "./dispatch-button";

function App() {
  return (
    <CrispyToaster duration={5000}>
      <div className="h-screen w-screen bg-gradient-to-br from-indigo-800 to-indigo-400 grid place-items-center">
        <div className="text-center">
          <h1 className="text-6xl text-white mb-8">React Crispy Toast</h1>
          <DispatchButton />
        </div>
      </div>
    </CrispyToaster>
  );
}

export default App;

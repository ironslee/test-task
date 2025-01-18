import "./App.scss";
import { Nomenclature } from "./pages/Nomenclature";
import { SignIn } from "./components/SignIn";

import { useAppSelector } from "./hooks/useAppSelector";
import { Suspense } from "react";

function App() {
  const tokens = useAppSelector((state) => state.signInStore.tokens);

  if (!tokens.access_token) {
    return <SignIn />;
  }

  return (
    <>
      <Suspense fallback={<div>Загрузка страницы...</div>}>
        <Nomenclature />
      </Suspense>
    </>
  );
}

export default App;

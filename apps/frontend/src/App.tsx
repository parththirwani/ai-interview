import "../styles/global.css";
import { Form } from "./components/ui/form";
import { useState } from "react";
import { Result } from "./components/ui/result";
import { Interview } from "./components/ui/interview";
import { Toaster } from "sonner";

export function App() {
  const [page, setPage] = useState<"form" | "result" | "interview">("form")

  return (
    <div>
      {page == "form" && <Form/>}
      {page == "interview" && <Interview/>}
      {page == "result" && <Result/>}
      <Toaster/>
    </div>
  );
}

export default App;

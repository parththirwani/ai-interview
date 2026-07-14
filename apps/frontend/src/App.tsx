import "../styles/global.css";
import { Form } from "./components/ui/form";
import { Result } from "./components/ui/result";
import { Interview } from "./components/ui/interview";
import { BrowserRouter, Route, Routes } from "react-router";

export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form/>}/>
        <Route path="/interview/:interviewId" element={<Interview/>}/>
        <Route path="/result/:interviewId" element={<Result/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

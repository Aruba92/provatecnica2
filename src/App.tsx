import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home"/>}></Route>
        <Route path="/home" element={< Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

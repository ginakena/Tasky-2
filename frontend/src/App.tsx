import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Header from './components/PublicHeader';
import Home from './pages/Home';
import Register from './pages/Register';
import LoginPage from './pages/Login';
import TasksPage from "./pages/TasksPage";
import CreateTaskPage from "./pages/CreateTaskspage";
import { Footer } from './components/Footer'; 
import UpdateTaskPage from "./pages/UpdateTaskPage";
import TrashPage from "./pages/TrashPage";
import CompletedTasksPage from "./pages/CompletedTasksPage";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/theme";
import ProfilePage from "./pages/Profile";


const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/create-task" element={<CreateTaskPage />} />
            <Route path="/tasks/update/:id" element={<UpdateTaskPage />} />
            <Route path="/tasks/trash" element={<TrashPage />} />
            <Route path="/tasks/completed" element={<CompletedTasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

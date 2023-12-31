import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import CourseComponent from "./components/course-component";
import PostCourseComponent from "./components/postCourse-component"
import EnrollCourseComponent from "./components/enrollCourse-component"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeComponent />}></Route>
          <Route path="register" element={<RegisterComponent />}></Route>
          <Route path="login" element={<LoginComponent />}></Route>
          <Route path="profile" element={<ProfileComponent />}></Route>
          <Route path="course" element={<CourseComponent />}></Route>
          <Route path="postCourse" element={<PostCourseComponent />}></Route>
          <Route path="enrollCourse" element={<EnrollCourseComponent />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

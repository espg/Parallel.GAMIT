import { AuthProvider } from "@hooks/useAuth";
import { Error, Login, Main, Users } from "@pagesReact";
import { Station } from "@componentsReact";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute, UnprotectedRoute } from "@routes/index";

function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/auth/" element={<UnprotectedRoute />}>
                            <Route path="login" element={<Login />} />
                            <Route path="*" element={<Error />} />
                        </Route>
                        <Route path="/" element={<ProtectedRoute />}>
                            <Route path="/" element={<Main />} />
                            <Route path="/:nc/:sc" element={<Station />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="*" element={<Error />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
}

export default App;

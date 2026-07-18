import { useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";

import API_URL from "../config/api";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            // Save JWT
            localStorage.setItem("token", data.token);

            // Check where the user should go after login
            const returnTo =
                location.state?.returnTo || "/profile";

            navigate(returnTo);

        } catch (error) {
            console.error(error);
            setMessage("Login failed");
        }
    }

    function handleRegister() {
        const returnTo =
            location.state?.returnTo || "/profile";

        navigate("/register", {
            state: {
                returnTo
            }
        });
    }

    return (
        <div className="auth-page">

            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <h1>Login</h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

                {message && (
                    <p className="login-message">
                        {message}
                    </p>
                )}

                <p className="register-link">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </p>

                <button
                    type="button"
                    className="home-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>

            </form>

        </div>
    );
}
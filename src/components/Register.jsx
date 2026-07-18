import { useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";

import API_URL from "../config/api";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();


            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Registration failed"
                );

                return;
            }


            const returnTo =
                location.state?.returnTo ||
                "/profile";


            // Go to OTP verification
            navigate(
                "/verify-otp",
                {
                    state: {
                        email:
                            data.email ||
                            form.email,

                        returnTo
                    }
                }
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setMessage(
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    }


    function handleLogin() {
        const returnTo =
            location.state?.returnTo ||
            "/profile";

        navigate(
            "/login",
            {
                state: {
                    returnTo
                }
            }
        );
    }


    return (
        <form
            className="register-form"
            onSubmit={handleSubmit}
        >

            <h1>
                Register
            </h1>


            <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />


            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />


            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Creating Account..."
                    : "Register"
                }
            </button>


            {message && (
                <p>
                    {message}
                </p>
            )}


            <p>
                Already have an account?{" "}

                <button
                    type="button"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </p>


            <button
                type="button"
                className="home-button"
                onClick={() =>
                    navigate("/")
                }
            >
                ← Back to Home
            </button>

        </form>
    );
}
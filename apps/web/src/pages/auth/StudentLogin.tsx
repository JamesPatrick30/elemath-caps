import { LoginStudent } from "../../api/auth";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
export default function StudentLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { refreshUser } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await LoginStudent({ email, password });
            await refreshUser();

            console.log("Student login successful:", response.data);
            // Handle successful login, e.g., redirect to student dashboard
        }catch (error) {
            console.error("Student login failed:", error);
            // Handle login failure, e.g., show error message to user
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold">Student Login</h1>
                <p className="mt-3 text-2xl">Please enter your credentials to log in.</p>
                <form className="mt-8 w-full max-w-md" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
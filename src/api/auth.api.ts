import type { LoginDto, RegisterDto, AuthResponseDto } from "../types/auth.types";

const API_URL = "http://localhost:5291/api/auth";

export async function login(dto: LoginDto): Promise<AuthResponseDto> {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
    }

    return response.json();
}

export async function register(dto: RegisterDto): Promise<AuthResponseDto> {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrarse");
    }

    return response.json();
}

import { useState } from "react";
import { register } from "../api/auth.api";
import { createAuthor } from "../api/authors.api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const authResponse = await register(form);
      await createAuthor(form.email, form.firstName, form.lastName, form.phone, authResponse.token);
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-50 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Register User</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="">

          <div>
            <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-100">First Name</label>
            <div className="mt-2">
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-100 mt-2">Last Name</label>
            <div className="mt-2">
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="mt-2 block text-sm/6 font-medium text-gray-100">Phone</label>
            <div className="mt-2">
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className=" mt-2 block text-sm/6 font-medium text-gray-100">Email</label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="mt-2 block text-sm/6 font-medium text-gray-100">Password</label>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="mt-5">
              <button type="submit" 
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >Register</button>
            </div>
            
            <div className="mt-2">
              <a href="" onClick={()=> navigate("/")} className="text-sm/6 font-semibold text-white">¿Ya tienes una cuenta? Inicia sesión aquí</a>
            </div>
          </div>
          
        </form>
      </div>
    </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Icon from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/clienteAxios";


interface FormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

enum typePassword {
  password = "password",
  text = "text",
}

const Form = () => {
  const [signUp, setSignUp] = useState(false);
  const [type, setType] = useState<typePassword>(typePassword.password);
  const [icon, setIcon] = useState(eyeOff);

  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState("");
  const [succesMessage, setSuccessMessage] = useState("");
  const {
    register: logInRegister,
    handleSubmit: handleLogInSubmit,
    formState: { errors: errorsLogin },
    clearErrors: clearLogInErrors,
  } = useForm<FormData>();
  const {
    register: signUpRegister,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: errorsSignUp },
    clearErrors: clearSignUpErrors,
  } = useForm<SignUpFormData>();

  const onSubmitLogin: SubmitHandler<FormData> = async (data) => {
    event?.preventDefault();
    if ([data.email, data.password].includes("")) {
      return;
    }
    try {
      const dataBack : AxiosResponse = await clienteAxios.post("/users/log-in", data);
      localStorage.setItem('token', dataBack.data);
      navigate('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.msg);
        return;
      }
      return console.log(error);
    }
  };

  const onSubmitSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    if (
      [data.email, data.name, data.password, data.repeatPassword].includes("")
    ) {
      return;
    }
    try {
      const { repeatPassword, ...restData } = data;
      const dataBack: AxiosResponse = await clienteAxios.post(
        "/users/sign-up",
        restData
      );
      setSuccessMessage(dataBack.data.msg);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.msg);
        return;
      }
      return console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      clearLogInErrors(["email", "password"]);
    }, 3000);
  }, [logInRegister]);

  useEffect(() => {
    setTimeout(() => {
      clearSignUpErrors(["email", "name", "password", "repeatPassword"]);
    }, 3000);
  }, [signUpRegister]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }, [errorMessage]);
  
  useEffect(() => {
    if(succesMessage.length > 0){
      setTimeout(() => {
        setSuccessMessage('')
        window.location.reload();
      }, 3000)
    }
  }, [succesMessage])

  const handleToggleForm = () => {
    setSignUp(!signUp);
    setIcon(eyeOff);
    setType(typePassword.password);
    clearLogInErrors(["email", "password"]);
    clearSignUpErrors(["email", "name", "password", "repeatPassword"]);
  };

  const handleToggle = () => {
    if (type === typePassword.password) {
      setIcon(eye);
      setType(typePassword.text);
    } else {
      setIcon(eyeOff);
      setType(typePassword.password);
    }
  };




  return (
    <div className="relative w-full max-w-md mx-auto ">
      <div
        className={`transition-all duration-700 transform ${
          signUp ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } absolute w-full`}
      >
        <form
          onSubmit={handleSignUpSubmit(onSubmitSignUp)}
          className="bg-gradient-to-br from-cyan-600/50 to-cyan-500 rounded-xl text-gray-200 flex-col p-10"
        >
          {succesMessage.length > 0 && (
            <div className="flex justify-center items-center">
              <span className="bg-green-600 text-white p-2 rounded-md my-4 text-center">
                {succesMessage}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...signUpRegister("name", { required: "Name is required" })}
              className="bg-gray-200 rounded-md text-black px-2"
            />
            {errorsSignUp.name && (
              <span className="bg-red-500 text-white font-semibold p-2 text-center rounded-md">
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp;{errorsSignUp.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-semibold" htmlFor="emailSignUp">
              Email
            </label>
            <input
              type="text"
              id="emailSignUp"
              {...signUpRegister("email", { required: "Email is required" })}
              className="rounded-md bg-gray-200 px-2 text-black"
            />
            {errorsSignUp.email && (
              <span className="bg-red-500 text-white font-semibold p-2 rounded-md text-center">
                {" "}
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp;{errorsSignUp.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-semibold" htmlFor="passwordSignUp">
              Password
            </label>
            <div className="bg-gray-200 rounded-md text-black flex">
              <input
                type={type}
                id="passwordSignUp"
                {...signUpRegister("password", {
                  required: "Password is required",
                })}
                className="flex-1 bg-gray-200 rounded-md px-2"
              />
              <span
                className="flex justify-around items-center"
                onClick={handleToggle}
              >
                <Icon className="absolute mr-10" icon={icon} size={15} />
              </span>
            </div>
            {errorsSignUp.password && (
              <span className="bg-red-500 text-white font-semibold p-2 text-center rounded-md">
                {" "}
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp; {errorsSignUp.password.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-semibold" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <div className="bg-gray-200 rounded-md text-black flex">
              <input
                type={type}
                id="repeatPassword"
                {...signUpRegister("repeatPassword", {
                  required: "Repeat Password is required",
                })}
                className="flex-1 bg-gray-200 rounded-md px-2"
              />
              <span
                className="flex justify-around items-center"
                onClick={handleToggle}
              >
                <Icon className="absolute mr-10" icon={icon} size={15} />
              </span>
            </div>
            {errorsSignUp.repeatPassword && (
              <span className="bg-red-500 text-white font-semibold p-2 rounded-md text-center">
                {" "}
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp; {errorsSignUp.repeatPassword.message}
              </span>
            )}
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-gradient-to-br from-gray-400 to-gray-200 font-semibold text-cyan-700 px-2 py-1 rounded-lg mt-10"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-5 w-auto" onClick={handleToggleForm}>
            <p className="cursor-pointer hover:text-gray-500 ease-in-out delay-100 duration-200">
              Log In
            </p>
          </div>
        </form>
      </div>

      {/* Log In Form */}
      <div
        className={`transition-all duration-700 transform ${
          !signUp ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } absolute w-full`}
      >
        <form
          onSubmit={handleLogInSubmit(onSubmitLogin)}
          className="bg-gradient-to-br from-cyan-600/50 to-cyan-500 rounded-xl text-gray-200 flex-col p-10 gap-4"
        >
          {errorMessage.length > 0 && (
            <div className="flex justify-center items-center">
              <span className="bg-red-600 text-white p-2 rounded-md my-4 text-center">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...logInRegister("email", { required: "Email is required" })}
              className="bg-gray-200 rounded-md text-black px-2"
            />
            {errorsLogin.email && (
              <span className="bg-red-500 text-white font-semibold text-center p-2 rounded-md">
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp; {errorsLogin.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-semibold" htmlFor="password">
              Password
            </label>
            <div className="bg-gray-200 rounded-md text-black flex">
              <input
                type={type}
                id="password"
                {...logInRegister("password", {
                  required: "Password is required",
                })}
                className="flex-1 bg-gray-200 px-2 rounded-md"
              />
              <span
                className="flex justify-around items-center"
                onClick={handleToggle}
              >
                <Icon className="absolute mr-10" icon={icon} size={15} />
              </span>
            </div>
            {errorsLogin.password && (
              <span className="bg-red-500 text-white font-semibold text-center rounded-lg flex items-center justify-center p-2">
                {" "}
                <span className="bg-white px-2 text-red-500 rounded-full">
                  !
                </span>
                &nbsp;{errorsLogin.password.message}
              </span>
            )}
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-gradient-to-br from-gray-400 to-gray-200 font-semibold text-cyan-700 px-2 py-1 rounded-lg mt-10"
              type="submit"
            >
              Log In
            </button>
          </div>
          <div className="text-center mt-5 w-auto" onClick={handleToggleForm}>
            <p className="cursor-pointer hover:text-gray-500 ease-in-out delay-100 duration-200">
              Sign Up
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

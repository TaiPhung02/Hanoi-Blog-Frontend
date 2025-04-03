import { useContext, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));

        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
        console.log(response);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/sign-in" : "/sign-up";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // formData
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;
    // form validation

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Tên đầy đủ phải dài ít nhất 3 chữ cái");
      }
    }

    if (!email.length) {
      return toast.error("Nhập email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Nhập email hợp lệ");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Mật khẩu phải dài từ 6 đến 20 ký tự bao gồm một số, 1 chữ thường và 1 chữ hoa"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user.accessToken,
        };

        userAuthThroughServer(serverRoute, formData);
      })
      .catch((error) => {
        toast.error("Sự cố khi đăng nhập qua google");
        return console.log(error);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section
        className="h-cover flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://bizweb.dktcdn.net/100/366/377/files/lang-bac-ho.jpg?v=1699677034595')",
        }}>
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Chào mừng trở lại" : "Tham gia ngay"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Tên đầy đủ"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            id="password"
            name="password"
            type="password"
            autocomplete
            placeholder="Mật khẩu"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}>
            {type === "sign-in" ? "Đăng nhập" : "Đăng ký"}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}>
            <img src={googleIcon} alt="googleIcon" className="w-5" />
            Tiếp tục với Google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Không có tài khoản ?
              <Link to="/sign-up" className="underline text-black text-xl ml-1">
                Tham gia ngay
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Đã là thành viên rồi ?
              <Link to="/sign-in" className="underline text-black text-xl ml-1">
                Đăng nhập tại đây.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;

import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {
  let {
    userAuth: { access_token, new_notification_available, isAdmin },
  } = useContext(UserContext);

  let page = location.pathname.split("/")[2];

  let [pageState, setPageState] = useState(page?.replace("-", " "));
  let [showSideNav, setShowsideNav] = useState(false);

  let activeTabLine = useRef();
  let sideBarIconTab = useRef();
  let pageStateTab = useRef();

  const changePageState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if (e.target == sideBarIconTab.current) {
      setShowsideNav(true);
    } else {
      setShowsideNav(false);
    }
  };

  useEffect(() => {
    setShowsideNav(false);

    pageStateTab.current.click();
  }, [pageState]);

  return access_token === null ? (
    <Navigate to="/sign-in" />
  ) : (
    <>
      <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
        <div className="sticky top-[80px] z-30">
          <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
            <button
              ref={sideBarIconTab}
              onClick={changePageState}
              className="p-5 capitalize"
            >
              <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
            </button>
            <button
              ref={pageStateTab}
              onClick={changePageState}
              className="p-5 capitalize"
            >
              {pageState}
            </button>
            <hr
              ref={activeTabLine}
              className="absolute bottom-0 duration-500"
            />
          </div>

          <div
            className={
              "min-w-[200px] h-[calc(100vh-80px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
              (!showSideNav
                ? "max-md:opacity-0 max-md:pointer-events-none"
                : "opacity-100 pointer-events-auto")
            }
          >
            <h1 className="text-xl text-dark-grey mb-3">Bảng điều khiển</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />

            {isAdmin ? (
              <NavLink
                to="/dashboard/blogs"
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-rr-document"></i>
                Nội dung
              </NavLink>
            ) : (
              ""
            )}

            {isAdmin ? (
              <NavLink
                to="/dashboard/users"
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-rr-user-pen"></i>
                Người dùng
              </NavLink>
            ) : (
              ""
            )}

            <NavLink
              to="/dashboard/notifications"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <div className="relative">
                <i className="fi fi-rr-bell-ring"></i>
                {new_notification_available ? (
                  <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                ) : (
                  ""
                )}
              </div>
              Thông báo
            </NavLink>

            {isAdmin ? (
              <NavLink
                to="/editor"
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-rr-edit"></i>
                Viết
              </NavLink>
            ) : (
              ""
            )}

            <h1 className="text-xl text-dark-grey mt-14 mb-3">Cài đặt</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />

            <NavLink
              to="/settings/edit-profile"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-user"></i>
              Chỉnh sửa hồ sơ
            </NavLink>

            <NavLink
              to="/settings/change-password"
              onClick={(e) => setPageState(e.target.innerText)}
              className="sidebar-link"
            >
              <i className="fi fi-rr-lock"></i>
              Đổi mật khẩu
            </NavLink>
          </div>
        </div>

        <div className="max-md:-mt-8 mt-5 w-full">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default SideNav;

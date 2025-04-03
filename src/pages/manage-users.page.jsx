import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import LoadMoreDataBtn from "../components/load-more.component";
import { getFullDay } from "../common/date";

const ManageUsers = () => {
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  let navigate = useNavigate();

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let user = JSON.parse(sessionStorage.getItem("user"));
  let isAdmin = user?.isAdmin;

  const getUsers = (searchQuery = "", page = 1) => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-non-admin-users", {
        params: { query: searchQuery, page },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = (user_id) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-user",
        { user_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        setUsers(users.filter((user) => user._id !== user_id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/page-not-found");
      return;
    }

    if (access_token && users == null) {
      getUsers(query, page);
    }
  }, [access_token, users, query, page, isAdmin, navigate]);

  const handleSearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setUsers(null);
      getUsers(searchQuery, 1);
    }
  };

  const handleChange = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (!searchQuery.length) {
      setUsers(null);
      getUsers("", 1);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Quản lý người dùng</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Tìm kiếm người dùng"
          value={query}
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation routes={["Người dùng"]}>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          <>
            {users.map((user, i) => (
              <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-10 border-b mb-6 max-md:px-4 border-grey pb-6">
                    <img
                      src={user.personal_info.profile_img}
                      alt={user.personal_info.username}
                      className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                    />
                    <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                      <h1 className="text-2xl font-medium">
                        Username: {user.personal_info.username}
                      </h1>
                      <p className="text-xl capitalize">
                        Fullname: {user.personal_info.fullname}
                      </p>
                      <p className="text-xl">
                        Email: {user.personal_info.email}
                      </p>
                      <p className="text-xl leading-7">
                        Tiểu sử:{" "}
                        {user.personal_info.bio.length
                          ? user.personal_info.bio
                          : "Chưa có tiểu sử"}
                      </p>
                      <p className="text-xl">
                        Tham gia vào {getFullDay(user.joinedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="underline text-red"
                    onClick={() => deleteUser(user._id)}
                  >
                    Xóa
                  </button>
                </div>
              </AnimationWrapper>
            ))}

            {/* <LoadMoreDataBtn state={users} fetchDataFun={getUsers} /> */}
          </>
        ) : (
          <NoDataMessage message="Không tìm thấy người dùng" />
        )}
      </InPageNavigation>
    </>
  );
};

export default ManageUsers;

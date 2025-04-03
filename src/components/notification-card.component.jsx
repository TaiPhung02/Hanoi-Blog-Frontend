import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

import ProfileDefault from "../imgs/profile-default.png";

const NotificationCard = ({ data, index, notificationState }) => {
  let [isReplying, setReplying] = useState(false);

  let {
    seen,
    type,
    reply,
    createdAt,
    comment,
    replied_on_comment,
    user,
    blog,
    _id: notification_id,
  } = data;

  let fullname, username, profile_img;

  if (user && user.personal_info) {
    ({ fullname, username, profile_img } = user.personal_info);
  } else {
    fullname = "Unknown User";
    username = "unknown";
    profile_img = ProfileDefault;
  }

  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      access_token,
      isAdmin,
    },
  } = useContext(UserContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  const handleReplyClick = () => {
    setReplying((preVal) => !preVal);
  };

  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        {
          _id: comment_id,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        if (type === "comment" && comment) {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deleteDocCount: notifications.deleteDocCount + 1,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={
        "p-6 border-b border-grey border-l-black " + (!seen ? "border-l-2" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img
          src={profile_img}
          alt="Profile Image"
          className="w-14 h-14 flex-none rounded-full"
        />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className="mx-1 text-black underline"
            >
              @{username}
            </Link>
            <span className="font-normal">
              {type === "like"
                ? "thích nội dung của bạn"
                : type === "comment"
                ? "bình luận ở"
                : "đã trả lời ở"}
            </span>
          </h1>

          {type === "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-grey">
              {replied_on_comment && replied_on_comment.comment ? (
                <p>{replied_on_comment.comment}</p>
              ) : (
                <p>Không có bình luận nào có sẵn!</p>
              )}
            </div>
          ) : blog && blog.blog_id ? (
            <Link
              to={`/blog/${blog.blog_id}`}
              className="font-medium text-dark-grey hover:underline line-clamp-1"
            >{`"${blog.title}"`}</Link>
          ) : (
            <p className="font-medium text-dark-grey">
              Bài viết đã có thể đã được xóa
            </p>
          )}
        </div>
      </div>

      {type !== "like" && comment && comment.comment ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">
          {comment.comment}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>

        {type !== "like" ? (
          <>
            {!reply ? (
              <button
                className="underline hover:text-black"
                onClick={handleReplyClick}
              >
                Trả lời
              </button>
            ) : (
              ""
            )}

            {isAdmin && comment && comment._id ? (
              <button
                className="underline hover:text-black"
                onClick={(e) => handleDelete(comment._id, "comment", e.target)}
              >
                Xóa
              </button>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>

      {isReplying && (
        <div className="mt-8">
          <NotificationCommentField
            _id={blog ? blog._id : null}
            blog_author={user}
            index={index}
            replyingTo={comment && comment._id}
            setReplying={setReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      )}

      {reply && (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
          <div className="flex gap-3 mb-3">
            <img
              src={author_profile_img}
              alt=""
              className="w-8 h-8 rounded-full"
            />

            <div>
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/user/${author_username}`}
                  className="mx-1 text-black underline"
                >
                  @{author_username}
                </Link>

                <span className="font-normal">replied to</span>

                <Link
                  to={`/user/${username}`}
                  className="mx-1 text-black underline"
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>

          <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>

          {isAdmin && reply._id && (
            <button
              className="underline hover:text-black ml-14 mt-2"
              onClick={(e) => handleDelete(reply._id, "reply", e.target)}
            >
              Xóa
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;

import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404.png";
import fullLogo from "../imgs/full-logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={pageNotFoundImage}
        alt="pageNotFoundImage"
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />

      <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        Trang bạn đang tìm kiếm không tồn tại.{" "}
        <Link to="/" className="text-black underline">
          Quay lại
        </Link>
      </p>

      <div className="mt-auto">
        <img
          src={fullLogo}
          alt="fullLogo"
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">Di tích lịch sử ở Hà Nội nổi tiếng, du khách không thể bỏ qua</p>
      </div>
    </section>
  );
};

export default PageNotFound;

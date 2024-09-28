import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "react-icons-kit";
import { lock } from "react-icons-kit/fa/lock";
import clienteAxios from "../config/clienteAxios";

import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import type { UserPropsBackend } from "../types/globals";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";
import { arrowRight } from "react-icons-kit/icomoon/arrowRight";

const MySwal = withReactContent(Swal);

const Home = () => {
  const navigate = useNavigate();

  // const [data, setData] = useState<UserPropsBackend[]>([]);
  const [localData, setLocalData] = useState<UserPropsBackend[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getPageParams = async () => {
      const params = new URLSearchParams(window.location.search);
      const pageParams = params.get("page");
      if (pageParams) {
        setPage(parseInt(pageParams));
        getAccounts(pageParams);
      } else {
        getAccounts(page.toString());
      }
    };
    const getAccounts = async (pageParams: string) => {
      const token = localStorage.getItem("token");
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const dataBack: AxiosResponse = await clienteAxios.get(
          `/users/get-users/${pageParams}`,
          config
        );
        setTotalPages(dataBack.data.totalPages);
        // setData(dataBack.data.users);
        setLocalData(dataBack.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getPageParams();
  }, []);

  const handleMoreData = async () => {
    if (page < totalPages) {
      setPage(page + 1);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const dataBack: AxiosResponse = await clienteAxios.get(
          `/users/get-users/${page + 1}`,
          config
        );
        setTotalPages(dataBack.data.totalPages);
        // setData(dataBack.data.users);
        setLocalData(dataBack.data.users);
      } catch (error) {
        console.error(error);
      }
      const nextPage = page + 1;
      navigate(`/home?page=${nextPage}`, { replace: true });
    }
    return;
  };

  const handleLessData = async () => {
    if (page > 1) {
      setPage(page - 1);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const dataBack: AxiosResponse = await clienteAxios.get(
          `/users/get-users/${page - 1}`,
          config
        );
        setTotalPages(dataBack.data.totalPages);
        // setData(dataBack.data.users);
        setLocalData(dataBack.data.users);
      } catch (error) {
        console.error(error);
      }
      const previousPage = page - 1;
      navigate(`/home?page=${previousPage}`, { replace: true });
    }
    return;
  };

  const showAlert =
    (item: UserPropsBackend) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      MySwal.fire({
        title: <p>Alert!</p>,
        text: "Are you sure to block this account?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            const dataBack: AxiosResponse = await clienteAxios.put(
              "/users/update-user",
              { id: item.id },
              config
            );
            if (dataBack.status === 200) {
              MySwal.fire("Successful", `${dataBack.data.msg}`, "success").then(
                () => window.location.reload()
              );
              return;
            }
          } catch (error) {
            console.log(error);
            MySwal.fire("Error", "Something was wrong", "error");
          }
        } else if (result.isDismissed) {
          MySwal.fire("Cancel", "User without changes", "error");
        }
      });
    };


  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-center">
            <th scope="col" className="px-3 py-3 w-1/12">
              <Icon icon={lock} size={15} />
            </th>
            <th scope="col" className="px-2 py-3 w-1/5">
              Name
            </th>
            <th scope="col" className="px-2 py-3">
              e-Mail
            </th>
            <th scope="col" className="px-4 py-3 text-end">
              Last login
            </th>
            <th scope="col" className="px-2 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {localData.map((item: UserPropsBackend) => (
            <tr
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-center"
              key={item.id}
            >
              <th
                scope="row"
                className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/12"
              >
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={showAlert(item)}
                  className=""
                />
              </th>
              <td className="px-2 py-4">{item.name}</td>
              <td className="px-2 py-4">{item.email}</td>
              <td className="px-2 py-4 text-end">{item.last_conection}</td>
              <td className="px-2 py-4 w-1/6">
                {item.active ? "Active" : "Blocked"}
              </td>
            </tr>
          ))}
        </tbody>
        <div className="flex gap-4 justify-center items-center m-4 overflow-hidden ">
          <div
            className={`${
              page == 1 || 0 ? "cursor-default text-gray-600" : "cursor-pointer"
            }`}
            onClick={handleLessData}
          >
            <Icon icon={arrowLeft} size={20} />
          </div>
          <div>
            <p className="font-bold text-xl text-cyan-700">{page}</p>
          </div>
          <p>of</p>
          <div>
            <p className="font-bold text-xl">{totalPages}</p>
          </div>
          <div
            className={`${
              page == totalPages
                ? "text-gray-600 cursor-default"
                : " cursor-pointer"
            }`}
            onClick={handleMoreData}
          >
            <Icon icon={arrowRight} size={20} />
          </div>
        </div>
      </table>
    </div>
  );
};

export default Home;

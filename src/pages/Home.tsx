import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "react-icons-kit";
import { lock } from "react-icons-kit/fa/lock";
import clienteAxios from "../config/clienteAxios";
import { jwtDecode } from "jwt-decode";

import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import type { UserPropsBackend } from "../types/globals";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";
import { arrowRight } from "react-icons-kit/icomoon/arrowRight";
import { ic_delete } from "react-icons-kit/md/ic_delete";

const MySwal = withReactContent(Swal);

export interface JwtPayload {
  user: {
    id: number;
    email: string;
    last_connection: string;
    name: string;
    active: boolean;
  };
  iat: number;
  exp: number;
}


const Home = () => {
  const navigate = useNavigate();

  // const [data, setData] = useState<UserPropsBackend[]>([]);
  const [localData, setLocalData] = useState<UserPropsBackend[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    document.title = 'Task 4 | Home'
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
            if(token){
              const decodedToken = jwtDecode<JwtPayload>(token);
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
                () => {
                  if(decodedToken.user.id == item.id){
                    localStorage.removeItem('token');
                    window.location.reload()
                  }
                  window.location.reload()
                  return;
                }
              );
              return;
            }
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

  const showAlertDelete = async (item: UserPropsBackend) => {
    MySwal.fire({
      title: <p>Alert!</p>,
      text: "Are you sure to delete this accounts?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const decodedToken = jwtDecode<JwtPayload>(token);

            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            const dataBack: AxiosResponse = await clienteAxios.put(
              "/users/delete-user",
              { id: item.id },
              config
            );
            if (dataBack.status === 200) {
              MySwal.fire("Successful", `${dataBack.data.msg}`, "success").then(
                () => {
                  if (decodedToken.user.id == item.id) {
                    localStorage.removeItem("token");
                    window.location.reload();
                    return;
                  }
                  window.location.reload();
                  return;
                }
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleBlockAll = async() => {
    MySwal.fire({
      title: <p>Alert!</p>,
      text: "Are you sure to block all account?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async(result) => {
      if(result.isConfirmed){
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          const dataBack: AxiosResponse = await clienteAxios.get("/users/block-all", config);
          if(dataBack.status === 200) {
            MySwal.fire("Successful", `${dataBack.data.msg}`, 'success').then(
              () => {
                localStorage.removeItem('token');
                window.location.reload();
                return;
              }
            )
          }
        } catch (error) {
          console.log(error);
          MySwal.fire("Error", "Something was wrong", "error");
        }
      }else if(result.isDismissed){
        MySwal.fire("Cancel", "Users without changes", "error");
      }
    })
  }
  const handleActiveAll = async() => {
    MySwal.fire({
      title: <p>Alert!</p>,
      text: "Are you sure to active all accounts?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async(result) => {
      if(result.isConfirmed){
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          const dataBack: AxiosResponse = await clienteAxios.get("/users/active-all", config);
          if(dataBack.status === 200) {
            MySwal.fire("Successful", `${dataBack.data.msg}`, 'success').then(
              () => {
                window.location.reload();
                return;
              }
            )
          }
        } catch (error) {
          console.log(error);
          MySwal.fire("Error", "Something was wrong", "error");
        }
      }else if(result.isDismissed){
        MySwal.fire("Cancel", "Users without changes", "error");
      }
    })
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-around">
      <div className="font-semibold text-white px-2 hover:text-cyan-600  transition-colors ease-in-out delay-100 duration-200 cursor-pointer" onClick={() => handleBlockAll()}>
        Block all
      </div>
      <div className="font-semibold text-white px-2 hover:text-cyan-600  transition-colors ease-in-out delay-100 duration-200 cursor-pointer" onClick={() => handleActiveAll()}>
        Active all
      </div>
      </div>
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
            <th scope="col" className="px-2 py-1 w-1/12">
              Delete
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
              <td className="px-2 py-4 text-end">
                {new Date(item.last_conection)
                  .toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })
                  .replace(",", "")}{" "}
              </td>
              <td className="px-2 py-4 w-1/6">
                {item.active ? "Active" : "Blocked"}
              </td>
              <td
                className="px-2 py-4 text-center"
                onClick={() => showAlertDelete(item)}
              >
                <Icon icon={ic_delete} size={20} />
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

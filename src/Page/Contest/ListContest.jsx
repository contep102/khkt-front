import React, { useContext, useEffect, useState } from "react";
import CardContest from "../../components/Card/CardContest";
import CardContestProgress from "../../components/Card/CardContestProgress";
import { Link } from "react-router-dom";
import SearchForm from "../../components/SearchForm";
import axios from "axios";
import { AppContext } from "../../Context/Context";

const ListContest = () => {
  const [dataTest, setDataTest] = useState([]);
  const [dataTestProgress, setDataTestProgress] = useState([]);
  const {
    datastate,

    setToastMessage,
    setOpenToast,

    setStatusToast,
  } = useContext(AppContext);

  useEffect(() => {
    try {
      const getData = async () => {
        const data = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/contest/get-contest-coming`
        );
        setDataTest(data.data);
      };
      getData();
    } catch (error) {
      setOpenToast(false);
      setStatusToast("Error something!");
      setToastMessage("Please fill all fields!");
      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    try {
      const getData = async () => {
        const data = await axios.post(
          `${import.meta.env.VITE_API_KEY}/api/contest/get-contest-progress`
        );
        setDataTestProgress(data.data);
      };
      getData();
    } catch (error) {
      setOpenToast(false);
      setStatusToast("Error something!");
      setToastMessage("Please fill all fields!");
      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full h-20"></div>
      <div className="w-full my-4 fixed top-20 flex gap-4 z-20 px-6">
        <div className="grow">
          <SearchForm />
        </div>
        <div className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-28 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg flex items-center justify-center">
          Filter
        </div>
      </div>
      <div className="grow grid grid-cols-4 mt-20 min-h-screen">
        <div className="col-span-3 grid grid-cols-1 gap-8 p-4 h-max">
          {dataTest.map((item, index) => (
            <CardContest
              name={item.Ten_Contest}
              key={index}
              des={item.Description}
              nameAd={item.Admin.name}
              avaAd={item.Admin.avatar}
              resStart={item.Thoi_Gian_Bat_Dau_Dang_Ky}
              resEnd={item.Thoi_Gian_Ket_Thuc_Dang_Ky}
              examStart={item.Thoi_Gian_Bat_Dau_Thi}
              examEnd={item.Thoi_Gian_Ket_Thuc_Thi}
              listRes={item.Thanh_Vien_Dang_Ky}
              idAd={datastate.id}
              contestId={item._id}
            />
          ))}
        </div>
        <div className="col-span-1 grid grid-cols-1 gap-8 p-4 h-max">
          {dataTestProgress.map((item, index) => (
            <CardContestProgress
              name={item.TenContest}
              key={index}
              user={item.Thanh_Vien_Dang_Ky}
              timeend={item.Thoi_Gian_Ket_Thuc}
              // nameAd={item.Admin.name}
              avaAd={item.admin.avatar}
              // resStart={item.Thoi_Gian_Bat_Dau_Dang_Ky}
              // resEnd={item.Thoi_Gian_Ket_Thuc_Dang_Ky}
              // examStart={item.Thoi_Gian_Bat_Dau_Thi}
              // examEnd={item.Thoi_Gian_Ket_Thuc_Thi}
              // listRes={item.Thanh_Vien_Dang_Ky}
              idAd={datastate.id}
              contestId={item._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListContest;

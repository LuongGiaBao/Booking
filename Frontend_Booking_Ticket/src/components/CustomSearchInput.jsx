import { Button, Divider, Typography, message } from "antd";
import { AutoComplete, Input, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import toImg from "../assets/images/to.png";
import fromImg from "../assets/images/from.png";
import dateImg from "../assets/images/date.png";
import { SwapOutlined } from "@ant-design/icons";
import { provinces } from "../services/api";
import { filterTrips } from "../services/trip";
import { useUser } from "../context/UserContext";

const { Text } = Typography;

function CustomSearchInput({ fromValue = "", toValue = "", dateValue = null }) {
  const [options, setOptions] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSlug, setFromSlug] = useState("");
  const [toSlug, setToSlug] = useState("");
  const [date, setDate] = useState(null);
  const { setTripsContext } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const initialFrom = provinces.find(
      (province) => province.slug === fromValue
    );

    const initialTo = provinces.find((province) => province.slug === toValue);

    if (initialFrom) {
      setFrom(initialFrom.name);
      setFromSlug(initialFrom.slug);
    }

    if (initialTo) {
      setTo(initialTo.name);
      setToSlug(initialTo.slug);
    }

    if (dateValue) {
      setDate(dateValue);
    }
  }, [fromValue, toValue, dateValue]);

  const onChangeDate = (date, dateString) => {
    console.log("Selected Date:", date); // Log để kiểm tra ngày
    setDate(date);
};

  const handleSearch = (value) => {
    const filteredOptions = provinces
      .filter((province) =>
        province.name.toLowerCase().includes(value.toLowerCase())
      )
      .map((province) => ({
        value: province.name,
        slug: province.slug,
      }));
    setOptions(filteredOptions);
  };

  const handleSelectFrom = (value, option) => {
    setFrom(value);
    setFromSlug(option.slug); // Cập nhật fromSlug khi chọn từ AutoComplete
  };

  const handleSelectTo = (value, option) => {
    setTo(value);
    setToSlug(option.slug); // Cập nhật toSlug khi chọn từ AutoComplete
  };

  const handleSwapLocation = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);

    const tmpSlug = fromSlug; // Hoán đổi slug của địa điểm
    setFromSlug(toSlug);
    setToSlug(tmpSlug);
  };

  const handleSearchClick = async () => {
    if (!fromSlug) {
      message.warning("Bạn chưa chọn nơi xuất phát");
      return;
    }
    if (!toSlug) {
      message.warning("Bạn chưa chọn nơi đến");
      return;
    }
    if (!date) {
      message.warning("Bạn chưa chọn ngày đi");
      return;
    }
  
    try {
      // Định dạng ngày thành YYYY-MM-DD
      const departureTime = dayjs(date).format("YYYY-MM-DD");
      
      // Gọi API để tìm chuyến đi
      const trips = await filterTrips(fromSlug, toSlug, departureTime);
      console.log("Trips fetched:", trips);
  
      if (trips.length === 0) {
        message.info("Không tìm thấy chuyến đi nào trong ngày này.");
      }
  
      setTripsContext(trips);
  
      // Điều hướng tới trang kết quả nếu có kết quả
      const queryString = `?from=${encodeURIComponent(
        fromSlug
      )}&to=${encodeURIComponent(toSlug)}&date=${encodeURIComponent(departureTime)}`;
      navigate(`/booking${queryString}`);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tìm kiếm chuyến đi");
    }
  };
  
  

  return (
    <div className="flex flex-row gap-4 justify-between">
      <div className="flex flex-row flex-1 h-[54px] border border-gray-300 rounded-lg justify-around">
        <div className="flex flex-row items-center">
          <img
            src={toImg}
            alt="toImg"
            className="h-[24px] w-[24px] object-cover"
          />
          <div className="relative pt-4">
            <Text className="text-center font-semibold ml-[10px] absolute top-0 left-0 z-10">
              Nơi xuất phát
            </Text>
            <AutoComplete
              value={from}
              onChange={handleSelectFrom}
              options={options}
              onSearch={handleSearch}
              onSelect={handleSelectFrom} // Đảm bảo chọn đúng slug khi chọn địa điểm
              placeholder="Nhập tên tỉnh thành"
            >
              <Input
                value={from}
                className="border-none focus:border-none focus:shadow-none"
              />
            </AutoComplete>
          </div>
        </div>
        <div className="relative">
          <Divider type="vertical" className="h-full"></Divider>
          <Button
            type="primary"
            shape="circle"
            className="absolute top-[10px] -left-2 bg-slate-300 text-[#484848]"
            icon={<SwapOutlined />}
            onClick={handleSwapLocation} // Hoán đổi địa điểm xuất phát và nơi đến
          />
        </div>

        <div className="flex flex-row items-center">
          <img
            src={fromImg}
            alt="fromImg"
            className="h-[24px] w-[24px] object-cover"
          />
          <div className="relative pt-4">
            <Text className="text-center font-semibold ml-[10px] z-10 absolute top-0 left-0">
              Nơi đến
            </Text>
            <AutoComplete
              value={to}
              options={options}
              onChange={handleSelectTo}
              onSearch={handleSearch}
              onSelect={handleSelectTo} // Đảm bảo chọn đúng slug khi chọn địa điểm
              placeholder="Nhập tên tỉnh thành"
            >
              <Input
                value={to}
                className="border-none focus:border-none focus:shadow-none"
              />
            </AutoComplete>
          </div>
        </div>

        <div className="flex flex-row items-center">
          <Divider type="vertical" className="h-full" />
          <img
            src={dateImg}
            alt="dateImg"
            className="h-[24px] w-[24px] object-cover"
          />
          <div className="relative pt-4">
            <Text className="text-center font-semibold ml-[10px] z-10 absolute top-0 left-0">
              Ngày đi
            </Text>
            <DatePicker
              value={date ? dayjs(date) : null}
              onChange={onChangeDate} // Cập nhật ngày khi chọn từ DatePicker
              className="border-none focus-within:border-none focus-within:shadow-none"
            />
          </div>
        </div>
      </div>
      <div>
        <Button
          type="primary"
          onClick={handleSearchClick} // Gọi hàm tìm kiếm khi nhấn vào nút Tìm Kiếm
          className="h-full font-medium text-lg text-[#141414] bg-[#ffd333] w-[148px] hover:!bg-yellow-300 hover:!border-[#ffd333] hover:!text-gray-600"
        >
          Tìm Kiếm
        </Button>
      </div>
    </div>
  );
}

export default CustomSearchInput;

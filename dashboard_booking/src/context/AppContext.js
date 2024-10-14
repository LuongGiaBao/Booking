import React, { createContext, useState, useEffect } from "react";
import { fetchUserInfo, getAllUsers } from "../services/user";
import { getAllBuses } from "../services/bus";
import { getAllPickupLocations } from "../services/pickupLocation";
import { getAllDropoffLocations } from "../services/dropoffLocation";
import { getAllTrips } from "../services/trip";
import { getAllSeats } from "../services/seat";
import { getAllTickets } from "../services/ticket";
import { getAllPromotions } from "../services/promotion"; // Add this line

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [dropoffLocations, setDropoffLocations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [seats, setSeats] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [promotions, setPromotions] = useState([]); // Add this line
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const loadData = async () => {
      if (token) {
        try {
          const userInfo = await fetchUserInfo(token);

          if (userInfo && userInfo.roles[0].name === "ADMIN") {
            const [
              userData,
              busData,
              pickupLocationData,
              dropoffLocationData,
              tripData,
              seatData,
              ticketData,
              promotionData, // Add this line
            ] = await Promise.all([
              getAllUsers(),
              getAllBuses(),
              getAllPickupLocations(),
              getAllDropoffLocations(),
              getAllTrips(),
              getAllSeats(),
              getAllTickets(),
              getAllPromotions(), // Add this line
            ]);

            setUsers(userData);
            setBuses(busData);
            setPickupLocations(pickupLocationData);
            setDropoffLocations(dropoffLocationData);
            setTrips(tripData);
            setSeats(seatData);
            setTickets(ticketData);
            setPromotions(promotionData); // Add this line
          }
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    loadData();
  }, [token]); // Thay đổi token sẽ trigger useEffect

  return (
    <AppContext.Provider
      value={{
        users,
        buses,
        pickupLocations,
        dropoffLocations,
        trips,
        seats,
        tickets,
        promotions, // Add this line
        setUsers,
        setBuses,
        setPickupLocations,
        setDropoffLocations,
        setTrips,
        setSeats,
        setTickets,
        setPromotions, // Add this line
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

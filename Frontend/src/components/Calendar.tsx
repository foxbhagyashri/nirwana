"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays, isBefore, startOfDay, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";

interface AdditionalRoomInfo {
  date: Date;
  additionalRooms: number;
  adultPrice: number | null;
  childPrice: number | null;
  isAllRooms: boolean;
}

interface Accommodation {
  rooms: number;
  adult_price: number;
  child_price: number;
}

interface CalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  onAvailableRoomsChange: (rooms: number | null) => void;
  minDate?: Date;
  label: string;
  accommodationId: string;
}

const API_BASE_URL = "https://api.nirwanastays.com";

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  onAvailableRoomsChange,
  minDate,
  label,
  accommodationId,
}) => {
  const [fullyBooked, setFullyBooked] = useState<Date[]>([]);
  const [hasAdditionalRooms, setHasAdditionalRooms] = useState<Date[]>([]);
  const [hasCustomPricing, setHasCustomPricing] = useState<Date[]>([]);
  const [additionalRoomsInfo, setAdditionalRoomsInfo] = useState<
    AdditionalRoomInfo[]
  >([]);
  const [bookedRoom, setBookedRoom] = useState<number>(0);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [availableRooms, setAvailableRooms] = useState<number | null>(null);
  const [baseRooms, setBaseRooms] = useState<number | null>(null);
  const [blockedRooms, setBlockedRooms] = useState<number | null>(null);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchAccommodation = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/properties/accommodations/${accommodationId}`
      );
      if (!res.ok) throw new Error("Failed to fetch accommodation");
      const data = await res.json();
      setAccommodation({
        rooms: data.basicInfo.rooms || 0,
        adult_price: data.packages.pricing.adult,
        child_price: data.packages.pricing.child,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [accommodationId]);

  useEffect(() => {
    if (availableRooms !== null && onAvailableRoomsChange) {
      onAvailableRoomsChange(availableRooms);
    }
  }, [availableRooms, onAvailableRoomsChange]);

  const fetchAdditionalRooms = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/calendar/blocked-dates/${accommodationId}`
      );
      const json = await res.json();
      if (json.success) {
        const dates: AdditionalRoomInfo[] = json.data.map((d: any) => {
          const roomsRaw = d.rooms;
          let additionalRooms = 0;
          let isAllRooms = false;

          // If rooms is 0 or null, no rooms are blocked
          // If rooms is negative (e.g., -2), that many rooms are blocked
          if (
            roomsRaw === null ||
            roomsRaw === "null" ||
            roomsRaw === "" ||
            roomsRaw === 0 ||
            roomsRaw === "0"
          ) {
            additionalRooms = 0;
            isAllRooms = false;
          } else {
            // Parse blocked rooms count - negative values indicate blocked rooms
            const parsedBlocked = parseInt(String(roomsRaw), 10);
            if (!isNaN(parsedBlocked)) {
              // If negative, use absolute value as blocked count
              // If positive, treat as 0 (shouldn't happen, but handle gracefully)
              additionalRooms = parsedBlocked < 0 ? Math.abs(parsedBlocked) : 0;
            }
            isAllRooms = false;
          }

          return {
            date: new Date(d.blocked_date),
            additionalRooms,
            adultPrice: d.adult_price ? parseFloat(d.adult_price) : null,
            childPrice: d.child_price ? parseFloat(d.child_price) : null,
            isAllRooms,
          };
        });

        setAdditionalRoomsInfo(dates);
      }
    } catch (err) {
      console.error(err);
    }
  }, [accommodationId]);

  const fetchTotalRoom = useCallback(
    async (date: Date) => {
      if (!accommodationId) return;
      setRoomsLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      try {
        const res = await fetch(
          `${API_BASE_URL}/admin/bookings/room-occupancy?check_in=${formattedDate}&id=${accommodationId}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookedRoom(data.total_rooms || 0);
        } else setBookedRoom(0);
      } catch {
        setBookedRoom(0);
      } finally {
        setRoomsLoading(false);
      }
    },
    [accommodationId]
  );

  // FIXED: Added occupancyOverride parameter
  const calculateAvailableRoomsForDate = useCallback(
    (date?: Date, occupancyOverride?: number) => {
      if (!date || !accommodation) return 0;
      const dateObj = startOfDay(date);
      const totalBaseRooms = accommodation.rooms;
      const additionalInfo = additionalRoomsInfo.find((a) =>
        isSameDay(a.date, dateObj)
      );
      let blockedRooms = 0;
      if (additionalInfo) {
        // additionalRooms now represents blocked rooms (from negative values)
        blockedRooms = additionalInfo.isAllRooms
          ? totalBaseRooms
          : additionalInfo.additionalRooms;
      }
      
      // FIX: Use override if provided (for calendar view), otherwise use state (for selected date)
      const currentOccupancy = occupancyOverride !== undefined ? occupancyOverride : bookedRoom;
      
      // Calculate available rooms: base rooms - booked rooms - blocked rooms
      const availableRooms = totalBaseRooms - currentOccupancy - blockedRooms;
      return Math.max(0, availableRooms);
    },
    [accommodation, additionalRoomsInfo, bookedRoom]
  );

  const calculateDateTypes = useCallback(() => {
    const today = startOfDay(new Date());
    const fully: Date[] = [];
    const additional: Date[] = [];
    const customPricing: Date[] = [];

    additionalRoomsInfo.forEach(
      ({ date, additionalRooms, isAllRooms, adultPrice, childPrice }) => {
        if (isBefore(date, today)) return;
        
        // FIX: Pass 0 as occupancy to avoid pollution from selected date
        const availableRooms = calculateAvailableRoomsForDate(date, 0);
        
        if (availableRooms <= 0) fully.push(date);
        else if (isAllRooms || additionalRooms > 0) additional.push(date);
        else if (adultPrice !== null || childPrice !== null)
          customPricing.push(date);
      }
    );

    setFullyBooked(fully);
    setHasAdditionalRooms(additional);
    setHasCustomPricing(customPricing);
  }, [additionalRoomsInfo, calculateAvailableRoomsForDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      const min = minDate ? startOfDay(minDate) : startOfDay(new Date());
      return isBefore(date, min) || fullyBooked.some((d) => isSameDay(d, date));
    },
    [fullyBooked, minDate]
  );

  const handleDateSelect = useCallback(
    async (date: Date | undefined) => {
      if (!date || isDateDisabled(date)) return;

      const localDate = new Date(date);
      localDate.setHours(12, 0, 0, 0);

      setRoomsLoading(true);
      await fetchTotalRoom(localDate);
      onDateSelect(localDate);
      setShowCalendar(false);
      setRoomsLoading(false);
    },
    [onDateSelect, isDateDisabled, fetchTotalRoom]
  );

  useEffect(() => {
    if (selectedDate && accommodation) {
      const dateObj = startOfDay(selectedDate);
      const additionalInfo = additionalRoomsInfo.find((a) =>
        isSameDay(a.date, dateObj)
      );
      let blocked = 0;
      if (additionalInfo) {
        // additionalRooms now represents blocked rooms (from negative values)
        blocked = additionalInfo.isAllRooms
          ? accommodation.rooms
          : additionalInfo.additionalRooms;
      }
      setBaseRooms(accommodation.rooms);
      setBlockedRooms(blocked);
      // Calculate available rooms: base rooms - booked rooms - blocked rooms
      const available = accommodation.rooms - bookedRoom - blocked;
      setAvailableRooms(available);
    } else {
      setAvailableRooms(null);
      setBaseRooms(null);
      setBlockedRooms(null);
    }
  }, [selectedDate, accommodation, bookedRoom, additionalRoomsInfo]);

  useEffect(() => {
    if (accommodationId) {
      setLoading(true);
      fetchAccommodation();
      fetchAdditionalRooms();
    }
  }, [accommodationId, fetchAccommodation, fetchAdditionalRooms]);

  useEffect(() => {
    calculateDateTypes();
  }, [additionalRoomsInfo, bookedRoom, calculateDateTypes]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
      </div>
    );

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-center focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition-all"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Select a date"}
      </button>

      {showCalendar && (
        <div className="relative z-20 mt-2 w-full -mx-2 sm:mx-0">
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-xl border border-gray-200 w-[calc(100%+1rem)] sm:w-full calendar-container ml-0 mr-0 sm:mx-auto">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              fromDate={minDate || new Date()}
              toDate={addDays(new Date(), 365)}
              disabled={isDateDisabled}
              modifiers={{ fullyBooked, hasAdditionalRooms, hasCustomPricing }}
              modifiersClassNames={{
                fullyBooked:
                  "bg-red-500 text-white line-through cursor-not-allowed hover:bg-red-600",
                hasAdditionalRooms: "bg-green-100 text-green-900 font-medium",
                hasCustomPricing: "bg-purple-100 text-purple-900 font-medium",
                selected: "bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:bg-blue-600",
              }}
              className="bg-white w-full"
              style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}
            />

            <div className="flex flex-wrap gap-3 mt-4 text-xs justify-center border-t pt-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm" />
                <span>Fully Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 mr-2 rounded-sm border border-green-200" />
                <span>Additional Rooms</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-100 mr-2 rounded-sm border border-purple-200" />
                <span>Special Price</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-300 mr-2 rounded-sm" />
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {roomsLoading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          Checking availability...
        </div>
      )}

      {selectedDate && !roomsLoading && availableRooms !== null && (
        <div className="mt-2 text-sm animate-fade-in">
          <div className="text-green-700 font-semibold flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Available Rooms: {availableRooms}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;